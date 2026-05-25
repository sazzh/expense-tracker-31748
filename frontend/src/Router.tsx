import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import AppShellLayout from "./components/AppShellLayout";
import { AddExpensePage } from "./pages/AddExpense.page";
import { TrendsPage } from "./pages/Trends.page";
import { LoginPage } from "./pages/Login.page";
import { RegisterPage } from "./pages/Register.page";
import { useSyncExternalStore } from "react";
import { AdminPage } from "./pages/Admin.page";
import { UserActivityPage } from "./pages/UserActivity.page";
import { UserPage } from "./pages/User.page";
import { EditUserPage } from "./pages/EditUser.page";

// recheck localStorage for token every time it is updated
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function useAuth() {
  return useSyncExternalStore(subscribe,
    () => {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const expired = payload.exp * 1000 < Date.now();

      if (expired) {
        localStorage.removeItem("token");
        return false;
      }

      return true;
    }
  );
}

function useRole() {
  return useSyncExternalStore(subscribe, () => localStorage.getItem("role"));
}

// routes for only logged in users
function ProtectedRoute() {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// routes for only admin users
function AdminRoute() {
  const isAuthenticated = useAuth();
  const role = useRole();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (role !== "admin") {
    alert("You do not have permission to view this page")
    return <Navigate to='/' replace />
  }

  return <Outlet />;
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
            path: '/trends',
            element: <TrendsPage />
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: '/admin-dashboard',
            element: <AdminPage />
          },
          {
            path: '/admin/users/:id',
            element: <UserPage />
          },
          {
            path: '/admin/users/:id/expenses',
            element: <UserActivityPage />
          },
          {
            path: '/admin/users/:id/edit',
            element: <EditUserPage />
          },
        ]
      },
    ]
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}