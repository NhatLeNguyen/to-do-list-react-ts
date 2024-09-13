import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/pages/login_screen/Login";
import Signup from "@components/pages/signup_screen/Signup";
import HomeScreen from "@components/pages/home_screen/HomeScreen";
import { AppRoutesProps } from "@components/interfaces";

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  handleLogin,
  handleLogout,
}) => {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            <HomeScreen onLogout={handleLogout} userId={""} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
