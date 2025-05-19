import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UV_Contact: React.FC = () => {
  // State variables for form data, validation errors, and submit status
  const [form_data, set_form_data] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [form_validation_errors, set_form_validation_errors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submit_status, set_submit_status] = useState("");

  // Function to perform client-side validation on the contact form inputs
  const validateForm = (): boolean => {
    const errors = { name: "", email: "", subject: "", message: "" };
    let valid = true;

    if (form_data.name.trim() === "") {
      errors.name = "Name is required";
      valid = false;
    }
    if (form_data.email.trim() === "") {
      errors.email = "Email is required";
      valid = false;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(form_data.email)) {
        errors.email = "Invalid email address";
        valid = false;
      }
    }
    if (form_data.subject.trim() === "") {
      errors.subject = "Subject is required";
      valid = false;
    }
    if (form_data.message.trim() === "") {
      errors.message = "Message is required";
      valid = false;
    }

    set_form_validation_errors(errors);
    return valid;
  };

  // Handle changes for both input and textarea elements in the form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };

  // Submit function to send contact form data to the backend API
  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    set_submit_status("loading");
    try {
      const api_url = `${import.meta.env.VITE_API_BASE_URL}/contact/messages`;
      const response = await axios.post(api_url, form_data);
      if (response && response.data) {
        set_submit_status("success");
        set_form_data({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      set_submit_status("error");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-6">
          If you have any inquiries or feedback, please feel free to send us a
          message.
        </p>
        <form onSubmit={submitContactForm} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form_data.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {form_validation_errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {form_validation_errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form_data.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {form_validation_errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form_validation_errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="subject" className="block font-medium">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form_data.subject}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {form_validation_errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {form_validation_errors.subject}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form_data.message}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
            ></textarea>
            {form_validation_errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {form_validation_errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
          >
            {submit_status === "loading" ? "Sending..." : "Send Message"}
          </button>
          {submit_status === "success" && (
            <p className="text-green-500 mt-2">
              Your message has been sent successfully!
            </p>
          )}
          {submit_status === "error" && (
            <p className="text-red-500 mt-2">
              There was an error sending your message. Please try again later.
            </p>
          )}
        </form>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Contact Information</h2>
          <p className="mb-2">
            Email:{" "}
            <a
              href="mailto:contact@libyanhotfood.com"
              className="text-blue-500 hover:underline"
            >
              contact@libyanhotfood.com
            </a>
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="mt-6">
          <p>
            Go back to{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Homepage
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UV_Contact;