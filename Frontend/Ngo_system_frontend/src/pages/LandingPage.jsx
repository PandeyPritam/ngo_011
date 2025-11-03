import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  Heart,
  Users,
  Target,
  DollarSign,
  Star,
  ArrowRight,
  Shield,
  Globe,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// --- Static Data with Images ---
const STATIC_DATA = {
  hero: {
    title: "Join Hands for a Better Tomorrow",
    subtitle:
      "Empowering communities through donations and volunteer efforts. Together we can create lasting change and make a real difference in people's lives.",
    ctaText: "Start Making Impact",
    ctaLink: "/signup",
    bg: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80",
  },
  features: [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Easy Donations",
      description: "Quick and secure donation process for various causes with real-time tracking and instant confirmation.",
      color: "from-red-400 to-pink-500",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
      imageAlt: "People making donations"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Volunteer Network",
      description: "Join our community of dedicated volunteers across 50+ countries with flexible commitment options.",
      color: "from-blue-400 to-cyan-500",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Volunteers working together"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparent Process",
      description: "Track your impact with complete transparency and detailed reports on fund utilization.",
      color: "from-green-400 to-emerald-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Transparent analytics dashboard"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Making impact across communities worldwide with localized solutions and cultural sensitivity.",
      color: "from-purple-400 to-indigo-500",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Global community map"
    },
  ],
  stats: [
    { 
      label: "Lives Impacted", 
      value: "50,000+", 
      icon: <Users className="w-6 h-6" />,
      trend: "+25%",
      description: "Year over year growth"
    },
    { 
      label: "Active Volunteers", 
      value: "2,500+", 
      icon: <Heart className="w-6 h-6" />,
      trend: "+12%",
      description: "Active community members"
    },
    { 
      label: "Projects Completed", 
      value: "350+", 
      icon: <Target className="w-6 h-6" />,
      trend: "+18%",
      description: "Successful initiatives"
    },
    { 
      label: "Funds Raised", 
      value: "$5M+", 
      icon: <DollarSign className="w-6 h-6" />,
      trend: "+32%",
      description: "Total donations"
    },
  ],
};

// --- Body Animation Sparks Component ---
const BodyAnimationSparks = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      className="absolute inset-0 pointer-events-none"
      init={particlesInit}
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        particles: {
          number: { 
            value: 30,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: { 
            value: ["#ffffff", "#ffd1dc", "#a5b4fc", "#c7d2fe", "#ddd6fe"] 
          },
          shape: { 
            type: "circle",
          },
          opacity: { 
            value: { min: 0.1, max: 0.4 },
            animation: {
              enable: true,
              speed: 2,
              sync: false
            }
          },
          size: { 
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 4,
              minimumValue: 0.1,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          twinkle: {
            particles: {
              enable: true,
              color: "#ffffff",
              frequency: 0.05,
              opacity: 0.5
            }
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble"
            }
          },
          modes: {
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3
            }
          }
        }
      }}
    />
  );
};

// --- Animated Counter Component ---
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const valueNum = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  useEffect(() => {
    let start = 0;
    if (start === valueNum) return;

    const incrementTime = (duration * 1000) / valueNum;
    const timer = setInterval(() => {
      start += Math.ceil(valueNum / 50);
      setCount(start);
      if (start >= valueNum) {
        clearInterval(timer);
        setCount(valueNum);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [valueNum, duration]);

  if (typeof value === 'string') {
    return <span>{value.replace(/\d+/, count.toLocaleString())}</span>;
  }

  return <span>{count.toLocaleString()}</span>;
};

// --- Enhanced Stats Section ---
const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,119,198,0.08)_0%,transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full"
            initial={{ y: 0, x: Math.random() * 100 }}
            animate={{
              y: [0, -100, 0],
              x: [Math.random() * 100, Math.random() * 100 + 50],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-gray-300">Making Real Impact</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time statistics showing the tangible difference we're making together in communities worldwide.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATIC_DATA.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-pink-500/30 transition-all duration-500 shadow-2xl hover:shadow-pink-500/20"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-500/20 group-hover:from-pink-500/30 group-hover:to-blue-500/30 transition-all duration-500">
                    {React.cloneElement(stat.icon, {
                      className: "w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors"
                    })}
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30"
                  >
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-medium text-green-400">{stat.trend}</span>
                  </motion.div>
                </div>

                <motion.h3 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: i * 0.1 + 0.5 }}
                >
                  <AnimatedCounter value={stat.value} duration={2} />
                </motion.h3>
                
                <p className="text-gray-400 font-medium text-sm group-hover:text-gray-300 transition-colors mb-2">
                  {stat.label}
                </p>

                <p className="text-gray-500 text-xs">
                  {stat.description}
                </p>
                
                {/* Animated Progress Bar */}
                <motion.div 
                  className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: i * 0.1 + 0.7, duration: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: ["0%", "100%"] }}
                    transition={{ delay: i * 0.1 + 0.9, duration: 1.5, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "200px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-12 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full"
        />
      </div>
    </section>
  );
};

// --- Enhanced CTA Section ---
const CTASection = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.15)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1)_0%,transparent_50%)]"></div>
        
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          {/* Main CTA Card */}
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: '2px',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 mb-8"
              >
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span className="font-semibold text-white">Join Our Mission Today</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
              >
                Ready to Make a <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Difference</span>?
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Join thousands of compassionate donors in our mission to create lasting change. 
                Every contribution, no matter the size, helps build a brighter future for those in need.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onClick={() => navigate("/signup")}
                  className="relative px-12 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 font-semibold text-white shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Animated background shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "200%" : "-100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <span className="relative flex items-center gap-3">
                    Start Making Impact
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 font-semibold text-white hover:bg-white/20 transition-all duration-300"
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-white/10"
              >
                {[
                  { icon: <Shield className="w-5 h-5" />, text: "100% Secure" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Transparent" },
                  { icon: <Globe className="w-5 h-5" />, text: "Global Impact" },
                  { icon: <Award className="w-5 h-5" />, text: "Award Winning" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Enhanced Hero Section ---
const HeroSection = () => {
  const navigate = useNavigate();
  const { hero } = STATIC_DATA;
  
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Animated Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero.bg})`,
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>

      {/* Enhanced Spark Particles */}
      <Particles
        className="absolute inset-0"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          particles: {
            number: { 
              value: 100,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: { 
              value: ["#ffffff", "#ffd1dc", "#a5b4fc", "#c7d2fe", "#ddd6fe"] 
            },
            shape: { 
              type: "circle",
            },
            opacity: { 
              value: { min: 0.2, max: 0.8 },
              animation: {
                enable: true,
                speed: 1,
                sync: false
              }
            },
            size: { 
              value: { min: 1, max: 5 },
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 0.1,
                sync: false
              }
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: true,
              straight: false,
              outModes: "out",
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            },
            twinkle: {
              particles: {
                enable: true,
                color: "#ffffff",
                frequency: 0.05,
                opacity: 1
              }
            }
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              }
            }
          }
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-8 h-8 bg-pink-400 rounded-full opacity-40"
        animate={{
          y: [0, 30, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">Trusted by 50K+ Volunteers</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            {hero.title.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="inline-block mr-4 last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
        >
          {hero.subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(hero.ctaLink)}
            className="bg-white text-purple-700 px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            {hero.ctaText}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="border-2 border-white text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300 backdrop-blur-sm"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// --- Enhanced Features Section with Images and Alternating Layout ---
const FeaturesSection = () => (
  <section className="py-24 px-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
    {/* Body Animation Sparks */}
    <BodyAnimationSparks />
    
    {/* Background Elements */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
    
    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">
          Why Choose Our Platform
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          We provide the tools and community to make your charitable efforts 
          <span className="text-purple-400 font-semibold"> effective and meaningful</span>
        </p>
      </motion.div>

      <div className="space-y-32">
        {STATIC_DATA.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            } items-center gap-16`}
          >
            {/* Image Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                {/* Main Image */}
                <motion.img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-96 object-cover"
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  whileHover={{ scale: 1.05 }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Floating Icon */}
                <motion.div
                  className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-br ${feature.color} text-white flex items-center justify-center rounded-2xl shadow-lg`}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: index * 0.3 + 0.5 
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"
                  animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
                <motion.div
                  className="absolute bottom-6 right-8 w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm"
                  animate={{
                    y: [0, 20, 0],
                    scale: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: index * 0.7
                  }}
                />
              </div>
              
              {/* Decorative Element */}
              <motion.div
                className={`absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-2xl -z-10 opacity-20`}
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 + 0.5 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 bg-purple-500/10 px-4 py-2 rounded-full mb-6 border border-purple-500/20"
              >
                <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                Feature {index + 1}
              </motion.div>
              
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {feature.description}
              </p>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + item * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-6 h-6 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </motion.div>
                    <span className="text-lg">Benefit {item} for {feature.title.toLowerCase()}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="group mt-8 inline-flex items-center gap-3 text-purple-400 font-semibold text-lg hover:text-purple-300 transition-colors duration-300 px-6 py-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
              >
                Learn More
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Final Component ---
export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}