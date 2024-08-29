import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { VALIDATIONS } from "../../constants";
import "./_login.scss";
import { LoginProps } from "../../interfaces";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateLogin = (formData: FormData): boolean => {
    let isValid = true;

    const loginValidations = VALIDATIONS.filter(
      (validation) => validation.id === "email" || validation.id === "password"
    );

    loginValidations.forEach((field) => {
      const value = formData.get(field.id)?.toString() || "";
      const errorMessage = field.validate(value);

      const errorElement = document.getElementById(`${field.id}Error`);
      if (errorMessage !== "") {
        isValid = false;
        if (errorElement) {
          errorElement.textContent = errorMessage as string;
        }
      } else {
        if (errorElement) {
          errorElement.textContent = "";
        }
      }
    });

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (validateLogin(formData)) {
      setIsSubmitting(true);
      try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const token = await userCredential.user.getIdToken();

        onLogin(token);
        alert("Login successful!");
        navigate("/home");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("An unknown error occurred.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="login-form" id="loginForm" onSubmit={handleSubmit}>
      <div className="login-text">Login</div>
      <p>Enter your email and password to sign in to your account.</p>
      <div className="email">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
        <div id="emailError" className="error-message"></div>
      </div>
      <div className="password">
        <div className="password-text">
          <label htmlFor="password">Password </label>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter a password"
        />
        <div id="passwordError" className="error-message"></div>
      </div>
      <button className="signin-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <div className="register-route">
        <p>Don't have an account? </p>
        <a href="/signup">Sign up</a>
      </div>
    </form>
  );
};

export default Login;
