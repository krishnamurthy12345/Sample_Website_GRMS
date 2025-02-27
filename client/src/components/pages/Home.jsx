
import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_ATTEMPTS = 5; // Maximum allowed failed attempts 
const LOCKOUT_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

const Home = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [errors, setErrors] = useState({ userName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, seAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  //  Check lockout status 
  useEffect(()=>{
    const storedAttempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
    const lockTime = localStorage.getItem("lockTime");

    if(storedAttempts >= MAX_ATTEMPTS && lockTime) {
      const timeElapsed = Date.now() - parseInt(lockTime);
      if(timeElapsed < LOCKOUT_DURATION) {
        setIsLocked(true);
        setTimeout(() =>{
          resetLockout();
        }, LOCKOUT_DURATION - timeElapsed);
      } else {
        resetLockout();
      }
    }
  },[]);

  const resetLockout = () =>{
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("lockTime");
    seAttempts(0);
    setIsLocked(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  

  const validateForm = () => {
    let isValid = true;
    let newErrors = { userName: "", password: "" };

    if (!formData.userName) {
      newErrors.userName = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.userName)) {
      newErrors.userName = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if(isLocked) {
      toast.error("Too many failed Attempts.Try again later.");
      return;
    }

    setLoading(true);
    setErrors({ userName: "", password: "" }); // Reset errors on new submit

    try {
      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/Auth/authorize",
        {
          userName: formData.userName,
          password: formData.password,
        }
      );

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;

        // Store tokens securely
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast.success("Login Successfully!"); // Fix toast
        window.dispatchEvent(new Event("storage")); // Force Header update
        navigate("/dashboard");
      } else {
        handleLoginError(response.data.message);
      }
    } catch (error) {
      handleLoginError(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (message) =>{
    toast.error(message || "Invalid credentials.Please try again.");
    setErrors((prev) => ({...prev, password: "Invalid Credentials."}));

    const newAttempts = attempts + 1;
    seAttempts(newAttempts);
    localStorage.setItem("loginAttempts",newAttempts);

    if(newAttempts >= MAX_ATTEMPTS) {
      const lockTime = Date.now();
      localStorage.setItem("lockTime",lockTime);
      setIsLocked(true);
      toast.error(`Too many failed attempts. Try again in 20 minutes.`);

      setTimeout(()=>{
        resetLockout();
      },LOCKOUT_DURATION);
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-xl text-center font-semibold my-7">Sign In</h2>
      {isLocked && (
        <p className="text-red-500 text-center mb-4">
          Too many failed attempts. Please wait 20 minutes.
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label> UserName</label>
        <input
          type="email"
          name="userName"
          placeholder="user name"
          className="bg-slate-100 rounded-lg p-2"
          value={formData.userName}
          onChange={handleChange}
          disabled={isLocked}
        />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}

        <label> Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-2 w-full pr-10"
            value={formData.password}
            onChange={handleChange}
            disabled={isLocked}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLocked}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          disabled={loading || isLocked}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-gray-500 ">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <button className="bg-gray-200 p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 disabled:opacity-70 w-full mb-2">
        <img
          src="https://img.icons8.com/color/24/000000/google-logo.png"
          alt="Google"
        />
        Sign in with Google
      </button>

      <button className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 w-full">
        <img
          src="https://img.icons8.com/color/24/000000/microsoft.png"
          alt="Microsoft"
        />
        Sign in with Microsoft
      </button>


      <ToastContainer />

    </div>
  );
};

export default Home;
