import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface GuestGuardProps {
  children: React.ReactElement;
}

const GuestGuard: React.FC<GuestGuardProps> = (props) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn
    ? props.children
    : React.createElement(Redirect, { to: "/developers" });
};

export default GuestGuard;
