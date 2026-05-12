import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import AppShellLayout from "./components/AppLayout";
import { AddExpensePage } from "./pages/AddExpense.page";
import { EditExpensePage } from "./pages/EditExpense.page";
import { TrendsPage } from "./pages/Trends.page";
import { LoginPage } from "./pages/Login.page";
import { RegisterPage } from "./pages/Register.page";
import { useSyncExternalStore } from "react";

// recheck localStorage for token every time it is updated
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function useAuth() {
  return useSyncExternalStore(subscribe, () => Boolean(localStorage.getItem("token")));
}

function ProtectedRoute() {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function ShellRoute() {
  return (
    <AppShellLayout>
      <Outlet />
    </AppShellLayout>
  )
}

const router = createBrowserRouter([
  {
    element: <ShellRoute />, children: [
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />
          },
          {
            path: '/expense',
            element: <AddExpensePage />
          },
          {
            path: '/expense/:expenseId',
            element: <EditExpensePage />
          },
          {
            path: '/trends',
            element: <TrendsPage />
          }
        ]
      }
    ]
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}