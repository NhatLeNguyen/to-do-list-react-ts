import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VALIDATIONS } from "@/components/constants";
import "./_signup.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@components/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRegister = (formData: FormData): boolean => {
    let isValid = true;

    VALIDATIONS.forEach((field) => {
      const value = formData.get(field.id)?.toString() || "";
      const errorMessage = field.validate(value);

      const errorElement = document.getElementById(`${field.id}Error`);
      if (errorMessage) {
        isValid = false;
        if (errorElement) {
          errorElement.textContent = Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage;
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

    if (validateRegister(formData)) {
      setIsSubmitting(true);
      try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const { user } = userCredential;

        // Save user information to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          password,
          createdAt: new Date(),
        });

        alert("Create account successfully!");
        navigate("/login");
      } catch (error) {
        alert(error);
      } finally {
        setIsSubmitting(false);
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
          name="name"
          placeholder="Enter your name"
        />
        <div id="nameError" className="error-message"></div>
      </div>
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter a password"
        />
        <div id="passwordError" className="error-message"></div>
      </div>
      <div className="confirm-password">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Enter a password"
        />
        <div id="confirmPasswordError" className="error-message"></div>
      </div>
      <div className="agree-checkbox">
        <div className="agree-content">
          <input type="checkbox" id="agree" name="agree" />
          <label htmlFor="agree">I agree to the above information</label>
        </div>
        <div id="agreeError" className="error-message"></div>
      </div>
      <button className="signup-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
      <div className="login-route">
        <p>You have an account?</p>
        <a href="/login">Sign in</a>
      </div>
    </form>
  );
};

export default Signup;
