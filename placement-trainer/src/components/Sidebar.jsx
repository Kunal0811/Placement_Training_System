import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Aptitude", path: "/aptitude", icon: "📘" },
    { name: "Technical", path: "/technical", icon: "💻" },
    { name: "Group Discussion", path: "/gd", icon: "🗣️" },
    { name: "Interview", path: "/interview", icon: "💼" },
  ];

  return (
    <div
      className={`bg-gray-900 text-white min-h-screen p-4 transition-all duration-300 shadow-lg shadow-blue-500/20 
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
    >

      {isOpen && (
        <>
          <h1 className="text-2xl font-bold mb-6">Modules</h1>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
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
