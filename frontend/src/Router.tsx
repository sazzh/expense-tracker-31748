import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import AppShellLayout from "./components/AppLayout";
import { AddExpensePage } from "./pages/AddExpense.page";

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
        path: '/',
        element: <HomePage />
      },
      {
        path: '/expense',
        element: <AddExpensePage />
      },
    ]
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}