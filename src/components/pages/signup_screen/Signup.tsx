import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VALIDATIONS } from "../../constants";
import "./_signup.scss";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  [key: string]: string | boolean;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: string;
  [key: string]: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validateRegister = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: "",
    };

    VALIDATIONS.forEach((field) => {
      if (field.id in formData) {
        const errorMessage = field.validate(formData[field.id].toString());
        if (errorMessage) {
          isValid = false;
          errors[field.id] = Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage;
        } else {
          errors[field.id] = "";
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateRegister()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Save user information to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date(),
        });

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
          value={formData.name}
          onChange={handleChange}
        />
        {formErrors.name && (
          <div className="error-message">{formErrors.name}</div>
        )}
      </div>
      <div className="email">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {formErrors.email && (
          <div className="error-message">{formErrors.email}</div>
        )}
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter a password"
          value={formData.password}
          onChange={handleChange}
        />
        {formErrors.password && (
          <div className="error-message">{formErrors.password}</div>
        )}
      </div>
      <div className="confirm-password">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Enter a password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {formErrors.confirmPassword && (
          <div className="error-message">{formErrors.confirmPassword}</div>
        )}
      </div>
      <div className="agree-checkbox">
        <div className="agree-content">
          <input
            type="checkbox"
            id="agree"
            name="Agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label htmlFor="agree">I agree to the above information</label>
        </div>
        {formErrors.agree && (
          <div className="error-message">{formErrors.agree}</div>
        )}
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
