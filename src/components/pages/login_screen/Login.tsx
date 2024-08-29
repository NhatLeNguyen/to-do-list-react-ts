import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { VALIDATIONS } from "../../constants";
import "./_login.scss";
import { LoginProps } from "../../interfaces";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const validateLogin = (): boolean => {
    let isValid = true;

    const loginValidations = VALIDATIONS.filter(
      (validation) => validation.id === "email" || validation.id === "password"
    );

    loginValidations.forEach((field) => {
      const value = field.id === "email" ? email : password;
      const errorMessage = field.validate(value);

      if (errorMessage !== "") {
        isValid = false;
        if (field.id === "email") {
          setEmailError(errorMessage as string);
        } else {
          setPasswordError(errorMessage as string);
        }
      } else {
        if (field.id === "email") {
          setEmailError("");
        } else {
          setPasswordError("");
        }
      }
    });

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateLogin()) {
      try {
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
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      <div className="password">
        <div className="password-text">
          <label htmlFor="password">Password </label>
        </div>
        <input
          type="password"
          id="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}
      </div>
      <button className="signin-button" type="submit">
        Sign in
      </button>
      <div className="register-route">
        <p>Don't have an account? </p>
        <a href="/signup">Sign up</a>
      </div>
    </form>
  );
};

export default Login;
