import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from 'axios';
import { FiHome, FiClipboard, FiInbox, FiSend, FiPlusSquare, FiSettings, FiSearch, FiBell, FiLogOut, FiLink, FiMenu, FiX } from "react-icons/fi";

import Feed from "./Sections/Feed";
import MyTasks from "./Sections/MyTask";
import Requests from "./Sections/Requests";
import MyRequests from "./Sections/MyRequests";
import AddTask from "./Sections/AddTask";
import Settings from "./Sections/Settings";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://hirehelper-batch-2-9124.onrender.com";

const Dashboard = () => {
  const [active, setActive] = useState("Feed");
  const [user, setUser] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
        navigate('/login');
        return;
    }

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/me`, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch(err) {
            console.error("Failed to fetch user");
        }
    };
    
    const fetchRequestCount = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/requests/incoming`, {
                headers: { 'x-auth-token': token }
            });
            setRequestCount(res.data.length);
        } catch(err) {
            console.error("Failed to fetch request count");
        }
    };

    const fetchNotifications = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
              axios.get(`${API_BASE}/api/notifications`, {
                headers: { 'x-auth-token': token }
              }),
              axios.get(`${API_BASE}/api/notifications/unread-count`, {
                headers: { 'x-auth-token': token }
              })
            ]);
            setNotifications(listRes.data || []);
            setUnreadCount(countRes.data?.count || 0);
        } catch (err) {
            console.error("Failed to fetch notifications");
        }
    };
    
    fetchUser();
    fetchRequestCount();
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 20000);
    const handleProfileUpdate = () => fetchUser();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };

  }, [navigate]);

  const handleLogout = (e) => {
    e.stopPropagation(); // 🔥 FIX
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleOpenNotifications = (e) => {
    e.stopPropagation();
    setShowNotif((prev) => !prev);
  };

  useEffect(() => {
    if (!showNotif) return;
    const handleClickOutside = () => setShowNotif(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotif]);

  const [openTaskId, setOpenTaskId] = useState(null);
  const openTaskIdRef = useRef(null);

  const renderPage = () => {
    const taskId = openTaskIdRef.current;
    switch (active) {
      case 'Feed': return <Feed searchQuery={searchQuery} openTaskId={taskId} />;
      case 'My Tasks': return <MyTasks searchQuery={searchQuery} openTaskId={taskId} />;
      case 'Requests': return <Requests />;
      case 'My Requests': return <MyRequests />;
      case 'Add Task': return <AddTask />;
      case 'Settings': return <Settings />;
      default: return null;
    }
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
                  ? `${API_BASE}${user.profile_picture}`
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
          {renderPage()}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;