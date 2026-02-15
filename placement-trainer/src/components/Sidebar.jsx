// placement-trainer/src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Aptitude", path: "/aptitude", icon: "⚡" },
    { name: "Technical", path: "/technical", icon: "💻" },
    { name: "Discussion", path: "/gd", icon: "💬" },
    { name: "Interview", path: "/interview", icon: "🎙️" },
    { name: "Resume AI", path: "/resume-analyzer", icon: "📄" },
  ];

  return (
    <div
      className={`h-[calc(100vh-2rem)] fixed left-2 top-4 transition-all duration-300 z-40
        ${isOpen ? "w-64" : "w-0 opacity-0 overflow-hidden"}`}
    >
      <div className="glass-panel h-full rounded-2xl p-4 flex flex-col border border-white/10">
        
        <div className="mb-0 px-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-4 p-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? "bg-gradient-to-r from-neon-blue/20 to-transparent text-neon-blue border-l-4 border-neon-blue" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                        {item.icon}
                    </span>
                    <span className="z-10">{item.name}</span>
                    {/* Glowing background effect on hover */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Gamified Ad / Banner at bottom */}
        

      </div>
    </div>
  );
};

export default Sidebar;