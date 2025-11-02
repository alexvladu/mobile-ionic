import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthGuardProps {
  children: React.ReactElement;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { isLoggedIn} = useAuth();
  return isLoggedIn
    ? props.children
    : React.createElement(Redirect, { to: "/login" });
};

export default AuthGuard;
