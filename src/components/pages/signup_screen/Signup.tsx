import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VALIDATIONS } from "../../constants";
import "./_signup.scss";

//authen
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [agreeError, setAgreeError] = useState<string>("");
  const navigate = useNavigate();

  const validateRegister = (): boolean => {
    let isValid = true;

    const registerValidations = VALIDATIONS.filter(
      (validation) =>
        validation.id === "name" ||
        validation.id === "email" ||
        validation.id === "password" ||
        validation.id === "confirmPassword" ||
        validation.id === "agree"
    );

    registerValidations.forEach((field) => {
      const element = document.getElementById(field.id) as HTMLInputElement;
      const errorMessage = field.validate(element.value);

      if (errorMessage !== "") {
        isValid = false;
        if (field.id === "name") {
          setNameError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        } else if (field.id === "email") {
          setEmailError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        } else if (field.id === "password") {
          setPasswordError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        } else if (field.id === "confirmPassword") {
          setConfirmPasswordError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        } else if (field.id === "agree") {
          setAgreeError(
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          );
        }
      } else {
        if (field.id === "name") {
          setNameError("");
        } else if (field.id === "email") {
          setEmailError("");
        } else if (field.id === "password") {
          setPasswordError("");
        } else if (field.id === "confirmPassword") {
          setConfirmPasswordError("");
        } else if (field.id === "agree") {
          setAgreeError("");
        }
      }
    });

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateRegister()) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Create account successfully!");
        navigate("/login");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <form className="register-form" id="registerForm" onSubmit={handleSubmit}>
      <div className="register-text">Create an Account</div>
      <p>Create account to get started.</p>
      <div className="name">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <div className="error-message">{nameError}</div>}
      </div>
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}
      </div>
      <div className="confirm-password">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Enter a password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPasswordError && (
          <div className="error-message">{confirmPasswordError}</div>
        )}
      </div>
      <div className="agree-checkbox">
        <div className="agree-content">
          <input
            type="checkbox"
            id="agree"
            name="Agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree">I agree to the above information</label>
        </div>
        {agreeError && <div className="error-message">{agreeError}</div>}
      </div>
      <button className="signup-button" type="submit">
        Create Account
      </button>
      <div className="login-route">
        <p>You have an account?</p>
        <a href="/login">Sign in</a>
      </div>
    </form>
  );
};

export default Signup;
