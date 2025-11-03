import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  AiOutlineMail, 
  AiOutlineLock, 
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
  AiOutlineSafetyCertificate
} from "react-icons/ai";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role, name, id } = res.data;

      if (token && role) {
        localStorage.setItem(
          "user",
          JSON.stringify({ token, role, name, id })
        );

        // Role-specific message
        let welcomeMessage = "";
        switch (role.toLowerCase()) {
          case "donor":
            welcomeMessage = `🎉 Welcome Donor! Happy donating, ${name || ""}`;
            break;
          case "volunteer":
            welcomeMessage = `🤝 Welcome Volunteer! Ready to help, ${name || ""}`;
            break;
          case "admin":
            welcomeMessage = `⚡ Welcome Admin! Manage the platform wisely, ${name || ""}`;
            break;
          default:
            welcomeMessage = `👋 Welcome, ${name || role}`;
        }

        // Show toast
        toast.success(welcomeMessage, {
          duration: 2000,
          position: "top-right",
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        });

        // Wait 2 seconds before navigating so user can see the toast
        setTimeout(() => {
          if (role.toLowerCase() === "donor") navigate("/donor");
          else if (role.toLowerCase() === "volunteer") navigate("/volunteer");
          else if (role.toLowerCase() === "admin") navigate("/admin");
          else navigate("/");
        }, 2000);

      } else {
        toast.error("Invalid login response. Missing token/role.", {
          duration: 3000,
          position: "top-right",
        });
        console.error("Invalid response:", res.data);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed. Try again.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      {/* Background Animation - Full Width */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <Toaster 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto" // Increased max-width for better layout
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
          >
            <AiOutlineUser className="text-4xl text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">Sign in to continue making a difference</p>
        </motion.div>

        <motion.form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Email Field */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-300 mb-4">
              Email Address
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-16 pr-5 py-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-300 mb-4">
              Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-16 pr-16 py-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                disabled={isLoading}
              >
                {showPassword ? <AiOutlineEyeInvisible className="text-2xl" /> : <AiOutlineEye className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-8">
            <a 
              href="/forgot-password" 
              className="text-purple-400 hover:text-purple-300 text-lg font-medium transition-colors duration-300"
            >
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-2xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-xl"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 transform"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8 }}
            />
            
            <span className="relative flex items-center justify-center gap-4">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <AiOutlineUser className="text-xl" />
                  </motion.div>
                </>
              )}
            </span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-6 text-gray-400 text-lg">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors duration-300"
              >
                Create Account
              </a>
            </p>
          </div>
        </motion.form>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-lg flex items-center justify-center gap-3">
            <AiOutlineSafetyCertificate className="text-green-400 text-xl" />
            Secure login with encrypted credentials
          </p>
        </motion.div>

        {/* Demo Credentials Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 p-6 bg-white/5 rounded-2xl border border-white/10"
        >
          <p className="text-gray-400 text-base">
            <strong>Demo:</strong> Use your registered credentials to login
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Donor, Volunteer, or Admin accounts
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}