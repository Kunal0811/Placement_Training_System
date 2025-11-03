import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const keyFeatures = [
    { to: "/aptitude", icon: "🧮", text: "Aptitude Practice" },
    { to: "/interview", icon: "🤖", text: "AI Interview Prep" },
    { to: "/dashboard", icon: "📊", text: "Performance Analytics" },
    { to: "/dashboard", icon: "🌐", text: "Real-time Dashboard" },
  ];

  const platformFeatures = [
    {
      icon: "🧠",
      title: "AI-Powered Intelligence",
      desc: "Smart algorithms generate personalized questions and provide adaptive learning experiences.",
    },
    {
      icon: "⚡",
      title: "Real-time Feedback",
      desc: "Get instant AI-driven feedback with detailed explanations and improvement suggestions.",
    },
    {
      icon: "📊",
      title: "Comprehensive Analytics",
      desc: "Track progress with insights and placement trend analysis.",
    },
    {
      icon: "🎯",
      title: "Personalized Learning",
      desc: "Customized learning paths based on your target companies.",
    },
    {
      icon: "🤖",
      title: "AI Mock Interviews",
      desc: "Practice with AI interviewers simulating HR & technical rounds.",
    },
    {
      icon: "👥",
      title: "Group Discussion Training",
      desc: "AI-moderated GD practice with real-time communication feedback.",
    },
  ];

  const trainingModules = [
      {
        icon: "🧮",
        title: "Aptitude Training",
        desc: "Quantitative, Logical, and Verbal reasoning with 1000+ questions",
        points: ["25+ Topics Covered", "Difficulty Levels", "Timed Practice"],
      },
      {
        icon: "💻",
        title: "Technical Skills",
        desc: "Programming, DSA, and system design preparation",
        points: ["Different Languages", "Live Coding", "Code Review"],
      },
      {
        icon: "🎤",
        title: "Interview Prep",
        desc: "AI-powered mock interviews with real-time feedback",
        points: ["HR Interviews", "Technical Rounds", "Behavioral Questions"],
      },
      {
        icon: "👥",
        title: "Group Discussion",
        desc: "Live GD sessions with AI analysis and peer interaction",
        points: ["Current Affairs", "Technical Topics", "Leadership Skills"],
      }
  ];

  return (
    <div className="p-4 space-y-32">
      {/* Hero Section */}
      <section className="relative text-center py-28 px-4 overflow-hidden rounded-3xl border border-neon-blue/20 bg-dark-card">
        <div 
          className="absolute inset-0 z-0 animate-pan-y"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2300BFFF" fill-opacity="0.1"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>')`,
            backgroundSize: '60px 60px',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent z-10"></div>
        <div className="relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-glow animate-float">
            AI-Powered <span className="text-neon-blue">Placement Training</span> System
          </h1> 
          <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-10">
            Comprehensive, intelligent, and automated training platform that prepares students for campus and off-campus placements with AI-driven feedback.
          </p>
          <div className="animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="bg-dark-bg/60 backdrop-blur-md rounded-2xl p-8 border border-neon-blue/20 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-neon-blue text-glow">
                ✨ Key Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {keyFeatures.map(feature => (
                  <Link to={feature.to} key={feature.text} className="bg-dark-card hover:bg-neon-blue hover:text-black rounded-lg p-4 text-center transition-all duration-300 transform hover:scale-110 border border-neon-blue/30 group">
                    <div className="text-4xl transition-transform duration-300 group-hover:scale-125">{feature.icon}</div>
                    <div className="text-sm mt-2 font-semibold text-gray-300 group-hover:text-black">{feature.text}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">Why Choose Our Platform?</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Our AI-driven approach makes placement preparation more effective, personalized, and comprehensive.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => (
            <div key={index} className="relative bg-dark-card p-8 rounded-2xl border border-neon-blue/20 overflow-hidden group transition-all duration-300 transform hover:-translate-y-2 hover:border-neon-blue">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-neon-blue">
                        {feature.title}
                    </h3>
                    <p className="text-gray-400">
                        {feature.desc}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">Training Modules</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive modules covering all aspects of placement preparation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainingModules.map((module, index) => (
            <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink to-neon-blue rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-dark-card p-8 rounded-xl h-full flex flex-col items-center text-center border border-gray-700">
                    <div className="text-6xl mb-4">{module.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-400 flex-grow">{module.desc}</p>
                    <div className="text-sm text-neon-blue/80 space-y-1 mt-4">
                        {module.points?.map((p, i) => <div key={i}>• {p}</div>)}
                    </div>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;