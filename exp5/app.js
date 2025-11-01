import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!nameRegex.test(formData.firstName)) {
      alert("First Name must contain only alphabets and at least 3 characters.");
      return false;
    }
    if (!formData.lastName) {
      alert("Last Name cannot be empty.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }
    if (!formData.address) {
      alert("Address cannot be empty.");
      return false;
    }

    alert("Registration Successful!\nName: Insha Khan\nRoll No: 23AI03\nBatch: A1");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address: "",
    });
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-heading">Register</h2>

        <label>First Name*</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label>Last Name*</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label>Address*</label>
        <textarea
          name="address"
          rows="3"
          value={formData.address}
          onChange={handleChange}
        ></textarea>

        <div className="buttons">
          <button type="submit" className="register-btn">
            Register
          </button>
          <button type="button" className="clear-btn" onClick={handleReset}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
