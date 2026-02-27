import { NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiCpu, FiCode, FiUserCheck, FiUsers, FiAward, FiFileText, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { stats } = useAuth();
  const level = stats?.level || 1;

  // Define modules and their required levels
  const MENUS = [
    { title: "Home", path: "/", icon: "🏠", reqLevel: 1 },
    { title: "Resume AI", path: "/resume-analyzer", icon: "📄", reqLevel: 1 },
    { title: "Aptitude Hub", path: "/aptitude", icon: "📖", reqLevel: 1 },
    { title: "Technical Hub", path: "/technical", icon: "💻", reqLevel: 2 },
    { title: "Mock Interview", path: "/interview", icon: <FiUserCheck />, reqLevel: 4 },
    { title: "Group Discussion", path: "/gd", icon: <FiUsers />, reqLevel: 4 },
  ];

  return (
    <div
      className={`h-[calc(100vh-2rem)] fixed left-2 top-4 transition-all duration-300 z-40
        ${isOpen ? "w-64" : "w-0 opacity-0 overflow-hidden"}`}
    >
      <div className="glass-panel h-full rounded-2xl p-4 flex flex-col border border-white/10">
        
        <div className="mb-0 px-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
          
        
        {MENUS.map((menu, index) => {
          const isLocked = level < menu.reqLevel;

          return (
            <NavLink
              key={index}
              to={isLocked ? "#" : menu.path} // Prevent navigation if locked
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isLocked 
                    ? "opacity-50 cursor-not-allowed bg-transparent hover:bg-red-500/10" 
                    : isActive 
                        ? "bg-neon-blue text-black font-bold shadow-[0_0_20px_rgba(45,212,191,0.3)]" 
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <div className={`text-xl ${isLocked ? "text-gray-600" : ""}`}>
                 {isLocked ? <FiLock /> : menu.icon}
              </div>
              
              {isOpen && (
                <span className={`whitespace-nowrap ${isLocked && "text-gray-500 line-through decoration-gray-700"}`}>
                  {menu.title}
                </span>
              )}

              {isOpen && isLocked && (
                 <span className="absolute right-4 text-[10px] font-black bg-gray-800 text-gray-400 px-2 py-1 rounded-md">
                     LVL {menu.reqLevel}
                 </span>
              )}

              {/* Tooltip for collapsed mode */}
              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-white/10 shadow-xl">
                  {menu.title} {isLocked && `(Lvl ${menu.reqLevel})`}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default Sidebar;