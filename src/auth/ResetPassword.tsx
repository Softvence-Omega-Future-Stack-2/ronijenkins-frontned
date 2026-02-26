import { useNavigate, useLocation } from "react-router-dom";
import bgImg from "../../public/images/bgImage.png";
import { useState } from "react";
import { useResetPasswordMutation } from "../redux/features/auth/authAPi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";


const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        otp,
        new_password: password,
         confirm_password: confirmPassword, 
      }).unwrap();

      console.log("Reset success:", res);

      toast.success("Password reset successful", {position:"top-right"});
      navigate("/login");

    } catch (error) {
      console.error("Reset failed:", error);
      toast.error("Password reset failed", {position:"top-right"});
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-white p-1 md:p-4">
      <div
        className="w-full flex max-w-[1800px] rounded-xl bg-cover bg-center items-center justify-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="w-full max-w-137 bg-white rounded-2xl shadow-xl m-2 p-3 md:p-6">

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

           <div>
  <label className="block mb-2">Password:</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-slate-50 border"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

          <div>
  <label className="block mb-2">Confirm Password:</label>
  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-slate-50 border"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
    >
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-activeBtnColor text-white py-3 rounded-lg font-semibold cursor-pointer"
            >
              {isLoading ? "Resetting..." : "Reset"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;