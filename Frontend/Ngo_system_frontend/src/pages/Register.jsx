import { useState } from "react";
import axios from "axios";
import { 
  AiOutlineUser, 
  AiOutlineUsergroupAdd, 
  AiOutlineSafetyCertificate,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlinePhone,
  AiOutlineEnvironment
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("Donor");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Send phone & location only if role is Donor or Volunteer
      const payload = role === "Admin"
        ? { name, email, password, role }
        : { name, email, password, role, phone, location };

      const res = await axios.post("http://localhost:5000/api/auth/register", payload);

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.token,
          role,
          name,
        })
      );
      alert("Signup successful! Role: " + role);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { 
      value: "Donor", 
      label: "Donor", 
      icon: <AiOutlineUser className="text-lg" />,
      description: "Make donations and support causes",
      color: "from-purple-500 to-pink-500"
    },
    { 
      value: "Volunteer", 
      label: "Volunteer", 
      icon: <AiOutlineUsergroupAdd className="text-lg" />,
      description: "Join volunteer programs and help communities",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      value: "Admin", 
      label: "Admin", 
      icon: <AiOutlineSafetyCertificate className="text-lg" />,
      description: "Manage platform and oversee operations",
      color: "from-green-500 to-emerald-500"
    },
  ];

  const selectedRole = roles.find((r) => r.value === role);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join Our Mission
          </h1>
          <p className="text-gray-400">
            Create your account and start making a difference
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSignup}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Choose Your Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <motion.button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
                    role === r.value
                      ? `border-transparent bg-gradient-to-r ${r.color} shadow-lg`
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`text-2xl mb-2 ${
                      role === r.value ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {r.icon}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      role === r.value ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {r.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Role Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedRole?.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center text-gray-400 text-sm mt-3"
              >
                {selectedRole?.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <AiOutlineUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ✅ Phone & Location only for Donor & Volunteer */}
            {(role === "Donor" || role === "Volunteer") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <AiOutlinePhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <AiOutlineEnvironment className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Enter your city or area"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <AiOutlineLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                  ) : (
                    <AiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? "Creating Account..." : `Sign Up as ${role}`}
            </span>
          </motion.button>
        </motion.form>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <AiOutlineSafetyCertificate className="text-green-400" />
            Your information is secure and encrypted
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
