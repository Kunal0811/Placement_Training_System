import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Aptitude", path: "/aptitude", icon: "🧮" },
    { name: "Technical", path: "/technical", icon: "💻" },
    { name: "Group Discussion", path: "/gd", icon: "👥" },
    { name: "Interview", path: "/interview", icon: "🎙️" },
    { name: "Resume Analyzer", path: "/resume-analyzer", icon: "📄" },
  ];

  return (
    <div
      className={`bg-dark-card text-white min-h-screen p-4 transition-all duration-300 border-r-2 border-neon-blue/30 
        ${isOpen ? "w-64" : "w-0 p-0 overflow-hidden"}`}
    >
      {isOpen && (
        <>
          <h1 className="text-2xl font-bold mb-8 text-neon-blue" style={{ textShadow: '0 0 4px #00BFFF' }}>Modules</h1>
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-lg text-lg transition-all duration-200 transform hover:translate-x-2 ${
                    isActive 
                      ? "bg-neon-blue text-black font-bold shadow-lg animate-glow" 
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;