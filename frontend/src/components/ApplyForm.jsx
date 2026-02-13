import React, { useState } from "react";
import API from "../services/api";
import "../App.css";

function ApplyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/save", formData);
      alert("Application Submitted Successfully ✅");
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      alert("Error submitting form ❌");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Apply Form</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ApplyForm;
