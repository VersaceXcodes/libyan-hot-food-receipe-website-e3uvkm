import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth_actions } from "@/store/main";

const UV_AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login_credentials, set_login_credentials] = useState({
    email: "",
    password: ""
  });
  const [login_error, set_login_error] = useState({ error: "" });
  const [is_loading, set_is_loading] = useState(false);

  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_login_credentials({
      ...login_credentials,
      [e.target.name]: e.target.value
    });
  };

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_is_loading(true);
    set_login_error({ error: "" });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        login_credentials
      );
      const { token, admin_id, username } = response.data;
      dispatch(
        auth_actions.set_auth_state({
          is_authenticated: true,
          token,
          admin_id,
          username
        })
      );
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin Login failed: ", error);
      let errorMessage = "Login failed. Please check your credentials.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        errorMessage = error.response.data.error;
      }
      set_login_error({ error: errorMessage });
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {login_error.error && (
            <div className="mb-4 text-red-600 text-center">
              {login_error.error}
            </div>
          )}
          <form onSubmit={submitLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={login_credentials.email}
                onChange={handle_change}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={login_credentials.password}
                onChange={handle_change}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={is_loading}
            >
              {is_loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UV_AdminLogin;