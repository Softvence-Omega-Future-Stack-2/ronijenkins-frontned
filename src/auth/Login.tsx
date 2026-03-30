import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "../graphql/operations";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  // LOGIN FUNCTION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("Please fill all fields", { position: "top-right" });
      return;
    }

    const toastId = toast.loading("Signing in...", { position: "top-right" });

    try {
      const { data } = (await login({
        variables: {
          input: { email, password },
        },
      })) as any;

      console.log("Login Response:", data);

      // const loginData = data?.login;

      // if (!loginData?.accessToken) {
      //   toast.update(toastId, {
      //     render: "Invalid credentials ",
      //     type: "error",
      //     isLoading: false,
      //     autoClose: 3000,
      //   });
      //   return;
      // }

      // Update Redux state to signal successful login (even if cookies are used)
      dispatch(
        setCredentials({
          user: null,
          token: null, // Token handled via cookies
          refreshToken: null,
        }),
      );

      // Success Toast
      toast.update(toastId, {
        render: "Login successful ",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-right",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      toast.update(toastId, {
        render: error?.message || "Login failed ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-6 md:p-8">
        <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold mb-2">
          Welcome Back
        </h2>
        <p className="text-subTitleColor text-sm font-medium mb-6">
          Sign in to your admin account
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              <EyeIcon />
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-black text-[#845E84]"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Admin Access Only */}
          <div className="pt-4 text-center">
            <div className="flex items-center gap-4">
              <div className="h-px bg-stone-100 flex-1"></div>
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                Admin Access Only
              </span>
              <div className="h-px bg-stone-100 flex-1"></div>
            </div>
            <p className="text-[11px] font-medium text-stone-300 mt-2">
              Protected by enterprise-grade security
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default LoginPage;
