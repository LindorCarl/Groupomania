import {createBrowserRouter} from "react-router-dom";
import Home from "../pages/Home";
import User from "../pages/User";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/home",
      element: <Home />
    },
    
    {
      path:"/user",
      element: <User />
    }
  ]);

export default router;