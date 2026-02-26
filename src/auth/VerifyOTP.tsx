import { useNavigate, useLocation } from "react-router-dom";
import bgImg from "../../public/images/bgImage.png";
import { useRef, useState } from "react";
import { useVerifyOTPMutation } from "../redux/features/auth/authAPi";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const email = location.state?.email;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const handleChange = (value: string, index: number) => {
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // move to next input
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text").slice(0, 6);

  if (!/^\d+$/.test(pastedData)) return;

  const newOtp = pastedData.split("");
  setOtp(newOtp);

  inputRefs.current[newOtp.length - 1]?.focus();
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }

    try {
    const res = await verifyOTP({
  email,
  otp: finalOtp,
  purpose: "password_reset",
}).unwrap();

      console.log("Verify success:", res);
      toast.success('OTP Verify success', {position:"top-right"})

      navigate("/reset_password", { state: { email } });

    } catch (error) {
      console.error("Verify failed:", error);
      toast.error('Invalid OTP', {position:"top-right"})

    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-white p-1 md:p-4">
      <div
        className="w-full flex max-w-[1800px] rounded-xl bg-cover bg-center items-center justify-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="w-full max-w-137 bg-white rounded-2xl m-2 shadow-xl p-2 md:p-8">

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Verify OTP
            </h2>
            <p className="text-gray-700 mt-2 mb-8">
              We have sent OTP to <span className="font-semibold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

           <div className="flex justify-between md:px-12 gap-1 mb-8">
  {otp.map((digit, index) => (
    <input
      key={index}
   ref={(el) => {
  inputRefs.current[index] = el;
}}
      type="text"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(e.target.value, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onPaste={handlePaste}
      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-primaryColor"
    />
  ))}
</div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-activeBtnColor text-white py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-blue-50 text-activeBtnColor py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;