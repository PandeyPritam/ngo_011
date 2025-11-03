import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlinePlusCircle, AiOutlineGift } from "react-icons/ai";

export default function DonationForm({ onDonationSubmit }) {
  const [type, setType] = useState("clothes");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return alert("You must be logged in to donate.");

      const { token } = JSON.parse(storedUser);
      if (!token) return alert("Invalid session. Please log in again.");

      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/donations",
        { type, quantity },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      // ✅ Notify parent (DonorPage) instead of navigating
      if (onDonationSubmit) {
        onDonationSubmit(res.data.donation || res.data); 
      }

      // Reset form fields
      setQuantity("");
      setType("clothes");
    } catch (err) {
      console.error("Donation error:", err);
      alert(err?.response?.data?.message || "Error creating donation");
    } finally {
      setLoading(false);
    }
  };

  const donationTypes = [
    { value: "clothes", label: "👕 Clothes", color: "from-blue-50 to-cyan-50 border-blue-200" },
    { value: "books", label: "📚 Books", color: "from-green-50 to-emerald-50 border-green-200" },
    { value: "food", label: "🍲 Food", color: "from-amber-50 to-orange-50 border-amber-200" },
    { value: "money", label: "💰 Money", color: "from-lime-50 to-green-50 border-lime-200" },
    { value: "others", label: "🎁 Others", color: "from-purple-50 to-pink-50 border-purple-200" },
  ];

  const getCurrentTypeColor = () => {
    const currentType = donationTypes.find(item => item.value === type);
    return currentType ? currentType.color : "from-purple-50 to-pink-50 border-purple-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-lg mx-auto"
    >
      <div className={`bg-gradient-to-br ${getCurrentTypeColor()} rounded-3xl shadow-xl border-2 p-8 mb-8 transition-all duration-500`}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4"
          >
            <AiOutlineGift className="text-2xl text-purple-600" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-2">
            Make a Donation
          </h2>
          <p className="text-gray-600 text-lg">
            Your generosity creates positive change
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Donation Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Select Donation Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {donationTypes.map((item) => (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    type === item.value
                      ? "bg-white shadow-lg border-purple-300 transform scale-105"
                      : "bg-white/50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{item.label.split(' ')[0]}</div>
                  <div className="text-xs font-medium text-gray-700">{item.label.split(' ')[1]}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quantity
            </label>
            <div className="relative">
              <motion.input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
                placeholder="Enter quantity"
                className="w-full p-4 pl-12 rounded-2xl border-2 border-gray-200 bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 text-lg font-medium"
                whileFocus={{ scale: 1.02 }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🎯
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-4">
              Minimum 1 item required
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Processing Donation...
              </>
            ) : (
              <>
                <AiOutlinePlusCircle size={20} />
                Submit Donation
              </>
            )}
          </motion.button>
        </form>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Your donation will be processed securely
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}