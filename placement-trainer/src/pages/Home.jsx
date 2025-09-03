import React from "react";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-blue-100 rounded-2xl overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Heading + Description */}
              <div>
                <h1 className="text-5xl font-bold mb-6 leading-tight transition-all">
                  <span className="hover:drop-shadow-lg transition-all">
                    AI-Powered{" "}
                    <span className="text-yellow-300">Placement Training</span> System
                  </span>
                </h1>

                <p className="text-xl mb-8 text-blue-100">
                  Comprehensive, intelligent, and automated training platform that
                  prepares students for campus and off-campus placements with AI-driven
                  feedback and personalized learning paths.
                </p>
              </div>

              {/* Right Side: Key Features Card */}
              <div className="animate-float shadow-lg transition-all rounded-2xl">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    ✨ Key Features
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 hover:bg-yellow-300 hover:text-black rounded-lg p-4 text-center transition-colors cursor-pointer">
                      <Link to="/aptitude">
                        <div className="text-2xl font-bold">🧮</div>
                        <div className="text-sm">Aptitude Practice</div>
                      </Link>
                    </div>
                    <div className="bg-white/20 hover:bg-green-300 hover:text-black rounded-lg p-4 text-center transition-colors cursor-pointer">
                      <div className="text-2xl font-bold">🤖</div>
                      <div className="text-sm">AI Interview Prep</div>
                    </div>
                    <div className="bg-white/20 hover:bg-blue-300 hover:text-black rounded-lg p-4 text-center transition-colors cursor-pointer">
                      <div className="text-2xl font-bold">📊</div>
                      <div className="text-sm">Performance Analytics</div>
                    </div>
                    <div className="bg-white/20 hover:bg-pink-300 hover:text-black rounded-lg p-4 text-center transition-colors cursor-pointer">
                      <div className="text-2xl font-bold">🌐</div>
                      <div className="text-sm">Real-time Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-driven approach makes placement preparation more effective, personalized, and
              comprehensive than traditional methods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI-Powered Intelligence",
                desc: "Smart algorithms generate personalized questions and provide adaptive learning experiences.",
                bg: "https://images.unsplash.com/photo-1695902173528-0b15104c4554?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },  
              {
                icon: "⚡",
                title: "Real-time Feedback",
                desc: "Get instant AI-driven feedback with detailed explanations and improvement suggestions.",
                bg: "https://media.istockphoto.com/id/2203725146/photo/robotic-hand-interacting-with-digital-feedback-stars-and-chat-bubbles-representing-customer.webp?a=1&b=1&s=612x612&w=0&k=20&c=5oloRP_2D3_un7xHA5WntIcb9rHcqBDtrrkgmurQuLg=",
              },
              {
                icon: "📊",
                title: "Comprehensive Analytics",
                desc: "Track progress with insights and placement trend analysis.",
                bg: "https://t3.ftcdn.net/jpg/15/88/69/76/240_F_1588697647_IYzumZ6WbYz0ZvQx4vkcTu0y791FXrbl.jpg",
              },
              {
                icon: "🎯",
                title: "Personalized Learning",
                desc: "Customized learning paths based on your target companies.",
                bg: "https://media.istockphoto.com/id/2164756285/photo/businessman-is-showing-concept-of-future-technology-and-internet-connection-network-with-ai.jpg?s=612x612&w=0&k=20&c=OXASLLxI1o0qDnN3NhFJt7ZcIS7vJ12sUPglgLzj9Rs=",
              },
              {
                icon: "🤖",
                title: "AI Mock Interviews",
                desc: "Practice with AI interviewers simulating HR & technical rounds.",
                bg: "https://img.freepik.com/free-photo/businessman-working-futuristic-office_23-2151003701.jpg",
              },
              {
                icon: "👥",
                title: "Group Discussion Training",
                desc: "AI-moderated GD practice with real-time communication feedback.",
                bg: "https://img.freepik.com/free-photo/futuristic-new-year-s-eve-celebration_23-2151084728.jpg",
              },
            ].map((feature, index) => (
              <div key={index} className="group [perspective:1000px] h-full">
                {/* Card container with 3D effect */}
                <div className="relative h-80 w-full hove:shadow-2xl transition-shadow transform hover:-translate-y-2 border duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 rounded-2xl shadow-md overflow-hidden flex flex-col items-center justify-center text-center bg-cover bg-center [backface-visibility:hidden]"
                    style={{ backgroundImage: `url(${feature.bg})` }}
                  >
                    <div className="bg-black/50 p-4 rounded-lg">
                      <span className="text-4xl mb-3">{feature.icon}</span>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 rounded-2xl shadow-md overflow-hidden bg-cover bg-center [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{ backgroundImage: `url(${feature.bg})` }}
                  >
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
                      <span className="text-4xl mb-3">{feature.icon}</span>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-200">{feature.desc}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Modules</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Comprehensive modules covering all aspects of placement preparation with
              industry-standard practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧮",
                title: "Aptitude Training",
                desc: "Quantitative, Logical, and Verbal reasoning with 1000+ questions",
                points: ["25+ Topics Covered", "Difficulty Levels", "Timed Practice"],
                bg: "https://img.freepik.com/free-vector/interesting-chemistry-facts-online-searching-self-education-exam-preparing-internet-surfing-man-woman-characters-browsing-scientific-website_335657-3273.jpg"
              },
              {
                icon: "💻",
                title: "Technical Skills",
                desc: "Programming, DSA, and system design preparation",
                points: ["10+ Languages", "Live Coding", "Code Review"],
                bg: "https://img.freepik.com/free-vector/coding-concept-illustration_114360-939.jpg"
              },
              {
                icon: "🎤",
                title: "Interview Prep",
                desc: "AI-powered mock interviews with real-time feedback",
                points: ["HR Interviews", "Technical Rounds", "Behavioral Questions"],
                bg: "https://img.freepik.com/premium-photo/new-folderman-ai-robot-waiting-job-interview-ai-vs-human-competition_1072857-2398.jpg"
              },
              {
                icon: "👥",
                title: "Group Discussion",
                desc: "Live GD sessions with AI analysis and peer interaction",
                points: ["Current Affairs", "Technical Topics", "Leadership Skills"],
                bg: "https://img.freepik.com/free-photo/people-hanging-out-with-robot_23-2151112112.jpg"
              }
            ].map((module, index) => (
              <div key={index} className="group [perspective:1000px]">
                <div className="relative h-80 w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center text-center bg-cover bg-center [backface-visibility:hidden]"
                    style={{ backgroundImage: `url(${module.bg})` }}
                  >
                    <div className="bg-black/50 p-4 rounded-lg">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">{module.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{module.title}</h3>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 rounded-xl shadow-md overflow-hidden bg-cover bg-center [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{ backgroundImage: `url(${module.bg})` }}
                  >
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                      <p className="text-gray-200 mb-3">{module.desc}</p>
                      <div className="text-sm text-gray-300 space-y-1">
                        {module.points.map((p, i) => (
                          <div key={i}>• {p}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
