import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = sessionStorage.getItem("authToken");
    return !!token;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (token: string) => {
    sessionStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    auth.signOut();
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
