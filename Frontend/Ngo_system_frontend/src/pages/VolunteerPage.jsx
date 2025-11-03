import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Medal,
  Package,
  Trophy,
  Star,
  CheckCircle,
  UserPlus,
  Users,
  Target,
  Calendar,
  User
} from "lucide-react";
import VolunteerForm from "./VolunteerForm";

export default function VolunteerPage() {
  const [donations, setDonations] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      const { token } = JSON.parse(storedUser);

      const dRes = await axios.get(
        "http://localhost:5000/api/volunteers/assigned",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations(Array.isArray(dRes.data) ? dRes.data : []);
      setHasProfile(true);
    } catch (err) {
      if (err.response?.status === 404) setHasProfile(false);
      else setError(err?.response?.data?.message || "Error fetching data");
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const { token } = JSON.parse(storedUser);

      const lRes = await axios.get(
        "http://localhost:5000/api/volunteers/leaderboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaderboard(Array.isArray(lRes.data) ? lRes.data : []);
    } catch (err) {
      console.log("Error fetching leaderboard:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileCreated = () => {
    setHasProfile(true);
    fetchData();
  };

  const markCompleted = async (id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `http://localhost:5000/api/donations/${id}/complete`,
        { completionProof: "Task done successfully" },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );
      fetchData();
    } catch (err) {
      alert("Error marking completed: " + (err?.response?.data?.message || err.message));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-cyan-700 font-medium text-lg">Loading Volunteer Dashboard...</p>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Authentication Required</h3>
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );

  const stats = {
    totalAssigned: donations.length,
    completed: donations.filter((d) => d.status === "completed").length,
    pending: donations.filter((d) => d.status === "assigned").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Volunteer Dashboard
          </h1>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Manage your assigned donations, track your progress, and climb the leaderboard to become a top volunteer
          </p>
        </motion.div>

        {/* Volunteer Registration */}
        {!hasProfile && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative text-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Join Our Volunteer Team</h2>
              <p className="text-cyan-100 text-lg max-w-2xl mx-auto">
                Complete your profile to start making a meaningful difference in your community and help those in need
              </p>
            </div>
            <div className="relative">
              <VolunteerForm onSuccess={handleProfileCreated} />
            </div>
          </motion.section>
        )}

        {/* Stats Overview */}
        {hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Total Assigned */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Assigned</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalAssigned}</p>
                </div>
              </div>
            </motion.div>

            {/* Completed */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.completed}</p>
                </div>
              </div>
            </motion.div>

            {/* Pending */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.pending}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Assigned Donations - Enhanced UI */}
        {hasProfile && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-white text-sm font-bold">{donations.length}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">My Assigned Donations</h2>
                  <p className="text-slate-600 text-lg">Manage and complete your assigned tasks efficiently</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  {stats.completed} Completed
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  {stats.pending} Pending
                </div>
              </div>
            </div>

            {donations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-2xl border-2 border-dashed border-blue-200/60 backdrop-blur-sm"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <Package className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-700 mb-3">No Assigned Donations</h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto mb-6">
                  You don't have any assigned donations yet. Check back later for new opportunities to help your community!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 cursor-pointer"
                >
                  <Target className="w-5 h-5" />
                  Check for New Tasks
                </motion.div>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {donations.map((d, index) => (
                  <motion.div
                    key={d._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                    
                    <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl transition-all duration-300 group-hover:border-blue-200/60 group-hover:scale-[1.02]">
                      <div className="flex items-start justify-between gap-6">
                        {/* Left Content */}
                        <div className="flex items-start gap-6 flex-1">
                          {/* Type Icon */}
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {d.type?.charAt(0).toUpperCase()}
                            </div>
                            {d.status === "completed" && (
                              <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Donation Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-xl font-bold text-slate-900 capitalize">{d.type}</h3>
                              <span
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                                  d.status === "assigned"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }`}
                              >
                                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                              </span>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                <Package className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">
                                  Quantity: {d.quantity}
                                </span>
                              </div>
                              
                              {d.pickupDate && (
                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                  <Calendar className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm font-medium text-amber-700">
                                    {new Date(d.pickupDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Donor Details */}
                            {d.donorId && (
                              <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Donor Information
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-slate-500">Name:</span>
                                    <p className="font-medium text-slate-800">{d.donorId.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Email:</span>
                                    <p className="font-medium text-slate-800">{d.donorId.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Phone:</span>
                                    <p className="font-medium text-slate-800">{d.donorId.phone}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Location:</span>
                                    <p className="font-medium text-slate-800">{d.donorId.location}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        {d.status === "assigned" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markCompleted(d._id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 text-lg whitespace-nowrap"
                          >
                            <CheckCircle className="w-6 h-6" />
                            Mark Completed
                          </motion.button>
                        )}

                        {d.status === "completed" && (
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
                            <CheckCircle className="w-5 h-5" />
                            Completed
                          </div>
                        )}
                      </div>

                      {/* Progress Bar for Completed Tasks */}
                      {d.status === "completed" && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                            <span>Task Progress</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: '100%' }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                Volunteer Leaderboard
              </h2>
              <p className="text-slate-600 text-lg">Top performing volunteers in our community</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg">
              {leaderboard.length} volunteers
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-200"
            >
              <Trophy className="w-20 h-20 text-amber-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-3">Leaderboard Empty</h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto">
                No leaderboard data available yet. Complete tasks to earn points and climb the ranks!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((v, i) => (
                <motion.div
                  key={v._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-2xl transition-all duration-300 group ${
                    i === 0
                      ? "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50"
                      : i === 1
                      ? "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50"
                      : i === 2
                      ? "border-orange-300 bg-gradient-to-r from-orange-50 to-red-50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ${
                          i === 0
                            ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
                            : i === 1
                            ? "bg-gradient-to-br from-blue-400 to-cyan-600 text-white"
                            : i === 2
                            ? "bg-gradient-to-br from-orange-400 to-red-600 text-white"
                            : "bg-gradient-to-br from-slate-400 to-slate-600 text-white"
                        }`}
                      >
                        {i === 0 && <Crown className="w-7 h-7" />}
                        {i === 1 && <Medal className="w-7 h-7" />}
                        {i === 2 && <Medal className="w-7 h-7" />}
                        {i > 2 && <span className="text-base">{i + 1}</span>}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{v.userId?.name}</h3>
                        <p className="text-slate-600 text-sm">{v.userId?.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <Star className="w-6 h-6 text-amber-500" />
                        <span className="text-3xl font-bold text-slate-900">{v.points}</span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">points</p>
                    </div>
                  </div>

                  {i === 0 && (
                    <div className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg">
                      <Crown className="w-4 h-4" />
                      Top Volunteer Champion
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}