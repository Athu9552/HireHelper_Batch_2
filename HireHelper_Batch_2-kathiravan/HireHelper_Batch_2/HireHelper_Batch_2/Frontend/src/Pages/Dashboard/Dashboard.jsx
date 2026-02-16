import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from 'axios';
import { FiHome, FiClipboard, FiInbox, FiSend, FiPlusSquare, FiSettings, FiSearch, FiBell, FiLogOut, FiLink } from "react-icons/fi";

import Feed from "./Sections/Feed";
import MyTasks from "./Sections/MyTask";
import Requests from "./Sections/Requests";
import MyRequests from "./Sections/MyRequests";
import AddTask from "./Sections/AddTask";
import Settings from "./Sections/Settings";

const Dashboard = () => {
  const [active, setActive] = useState("Feed");
  const [user, setUser] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
        navigate('/login');
        return;
    }
    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch(err) {
            console.error("Failed to fetch user");
            // Optionally redirect to login on failure
            // navigate('/login');
        }
    };
    
    const fetchRequestCount = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/requests/incoming', {
                headers: { 'x-auth-token': token }
            });
            setRequestCount(res.data.length);
        } catch(err) {
            console.error("Failed to fetch request count");
        }
    };
    
    fetchUser();
    fetchRequestCount();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const pages = {
    Feed: <Feed />,
    "My Tasks": <MyTasks />,
    Requests: <Requests />,
    "My Requests": <MyRequests />,
    "Add Task": <AddTask />,
    Settings: <Settings />
  };

  const menuItems = [
    { name: "Feed", icon: <FiHome /> },
    { name: "My Tasks", icon: <FiClipboard /> },
    { name: "Requests", icon: <FiInbox />, badge: requestCount > 0 ? requestCount : null },
    { name: "My Requests", icon: <FiSend /> },
    { name: "Add Task", icon: <FiPlusSquare /> },
    { name: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div className="dash-wrapper">
      <aside className="sidebar">
        <div className="brand">
            <div className="brand-logo"><FiLink /></div>
            <h2 className="brand-text">Hire-a-Helper</h2>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${active === item.name ? "active" : ""}`}
              onClick={() => setActive(item.name)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
              {item.badge && <span className="badge-count">{item.badge}</span>}
              {active === item.name && <div className="active-indicator"></div>}
            </div>
          ))}
        </nav>

        <div className="user-profile">
            <img 
              src={user ? `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff&bold=true` : "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff"} 
              alt="profile" 
              className="user-avatar" 
            />

            <div className="user-info">
                <h4>{user?.first_name} {user?.last_name}</h4>
                <p>{user?.email_id}</p>

            </div>
            <button onClick={handleLogout} className="logout-btn"><FiLogOut /></button>
        </div>
      </aside>

      <section className="main">
        <header className="navbar">
            <div className="header-left">
                <h3>{active}</h3>
                {active === "Feed" && <p className="subtitle">Find tasks that need help</p>}
                {active === "My Tasks" && <p className="subtitle">Manage your posted tasks</p>}
                {active === "Requests" && <p className="subtitle">People who want to help with your tasks</p>}
                {active === "My Requests" && <p className="subtitle">Track the help requests you've sent</p>}
            </div>
            
            <div className="header-right">
                <div className="search-wrapper">
                    <span className="search-icon"><FiSearch /></span>
                    <input type="text" placeholder="Search tasks..." className="search-bar" />
                </div>
                <div className="notification-bell">
                    <FiBell />
                    <span className="notif-dot"></span>
                </div>
            </div>
        </header>

        <div className="page-content">
          {pages[active]}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;