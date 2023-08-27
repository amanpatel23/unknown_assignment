import Navbar from "./components/Navbar/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import UserProvider from "./contexts/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import InviteUser from "./pages/InviteUser/InviteUser";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        { path: "/signin", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/inviteUser", element: <InviteUser /> },
      ],
    },
  ]);
  return (
    <>
      <UserProvider>
        <RouterProvider router={browserRouter} />
        <ToastContainer autoClose={3000} />
      </UserProvider>
    </>
  );
}

export default App;
