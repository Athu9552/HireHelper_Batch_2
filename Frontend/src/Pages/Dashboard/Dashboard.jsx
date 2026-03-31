import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from 'axios';
import { FiHome, FiClipboard, FiInbox, FiSend, FiPlusSquare, FiSettings, FiLogOut, FiLink, FiX } from "react-icons/fi";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getProfileImage = (profilePicture, firstName, lastName) => {
    if (!profilePicture) {
      return `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
    }
    if (profilePicture.startsWith("http")) return profilePicture;
    return `${apiBaseUrl}${profilePicture}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
        navigate('/login');
        return;
    }

    const fetchUser = async () => {
        try {
            const res = await axios.get(`/api/auth/me`, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch {
            console.error("Failed to fetch user");
        }
    };
    
    const fetchRequestCount = async () => {
        try {
            const res = await axios.get(`/api/requests/incoming`, {
                headers: { 'x-auth-token': token }
            });
            setRequestCount(res.data.length);
        } catch {
            console.error("Failed to fetch request count");
        }
    };
    
    fetchUser();
    fetchRequestCount();
    const handleProfileUpdate = () => fetchUser();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };

  }, [navigate]);

  const handleLogout = (e) => {
    e.stopPropagation(); // 🔥 FIX
    localStorage.removeItem('token');
    navigate('/login');
  };

  const pageContent = active === "Feed" ? <Feed /> :
    active === "My Tasks" ? <MyTasks /> :
    active === "Requests" ? <Requests /> :
    active === "My Requests" ? <MyRequests /> :
    active === "Add Task" ? <AddTask /> :
    active === "Settings" ? <Settings /> : null;

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
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
              <div className="brand-logo"><FiLink /></div>
              <h2 className="brand-text">Hire-a-Helper</h2>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <FiX />
          </button>
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
            </div>
          ))}
        </nav>

        <div className="user-profile" onClick={() => setActive("Settings")}>
            <img 
              src={
                user?.profile_picture
                  ? getProfileImage(user.profile_picture, user?.first_name, user?.last_name)
                  : `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`
              } 
              alt="profile" 
              className="user-avatar" 
            />

            <div className="user-info">
                <h4>{user?.first_name} {user?.last_name}</h4>
                <p>{user?.email_id}</p>
            </div>

            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut />
            </button>
        </div>
      </aside>

      <section className="main">
        <header className="navbar">
            <h3>{active}</h3>
        </header>

        <div className="page-content">
          {pageContent}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;