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

const RENDER_BASE = "https://hirehelper-batch-2-9l24.onrender.com";

const Dashboard = () => {
  const [active, setActive] = useState("Feed");
  const [user, setUser] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifRefreshKey, setNotifRefreshKey] = useState(0);
  const navigate = useNavigate();
  const openTaskIdRef = useRef(null);
  const [openTaskId, setOpenTaskId] = useState(null);

  const getProfileImage = (profilePicture, firstName, lastName) => {
    if (!profilePicture) return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff&bold=true`;
    if (profilePicture.startsWith("http")) return profilePicture;
    return `${RENDER_BASE}${profilePicture}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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

    const fetchNotifications = async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          axios.get(`/api/notifications`, { headers: { 'x-auth-token': token } }),
          axios.get(`/api/notifications/unread-count`, { headers: { 'x-auth-token': token } })
        ]);
        setNotifications(listRes.data || []);
        setUnreadCount(countRes.data?.count || 0);
      } catch {
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
    e.stopPropagation();
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

  const markAllNotificationsRead = async () => {
    if (notifications.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/notifications/read-all', {}, { headers: { 'x-auth-token': token } });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      console.error("Failed to mark notifications as read");
    }
  };

  const markNotificationRead = async (notificationId) => {
    const target = notifications.find((n) => n._id === notificationId);
    if (!target || target.read) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/notifications/read', { notificationId }, { headers: { 'x-auth-token': token } });
      setNotifications((prev) => prev.map((n) => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      console.error("Failed to mark notification as read");
    }
  };

  const handleNotificationClick = (n) => {
    markNotificationRead(n._id);
    setShowNotif(false);
    const isStatusUpdate = /was accepted|was rejected/i.test(n.message);
    if (isStatusUpdate || n.type === 'task_request_sent') {
      setActive('My Requests');
    } else if (n.type === 'task_request_received') {
      setActive('Requests');
    } else if (n.relatedTask) {
      const taskId = n.relatedTask._id || n.relatedTask;
      openTaskIdRef.current = taskId;
      setOpenTaskId(taskId);
      setActive('Feed');
    }
    setNotifRefreshKey((k) => k + 1);
  };

  const handleMenuClick = (itemName) => {
    setActive(itemName);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    const taskId = openTaskIdRef.current;
    switch (active) {
      case 'Feed': return <Feed searchQuery={searchQuery} openTaskId={taskId} onTaskOpened={() => { openTaskIdRef.current = null; setOpenTaskId(null); }} />;
      case 'My Tasks': return <MyTasks searchQuery={searchQuery} openTaskId={taskId} onTaskOpened={() => { openTaskIdRef.current = null; setOpenTaskId(null); }} />;
      case 'Requests': return <Requests key={notifRefreshKey} />;
      case 'My Requests': return <MyRequests key={notifRefreshKey} />;
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
              onClick={() => handleMenuClick(item.name)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
              {item.badge && <span className="badge-count">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="user-profile" onClick={() => setActive("Settings")}>
          <img
            src={getProfileImage(user?.profile_picture, user?.first_name, user?.last_name)}
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

      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <section className="main">
        <header className="navbar">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <FiMenu />
          </button>
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
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="notification-bell" onClick={handleOpenNotifications}>
              <FiBell />
              {unreadCount > 0 && <span className="notif-dot"></span>}
              {showNotif && (
                <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="notif-header">
                    <span>Notifications</span>
                    <button onClick={markAllNotificationsRead}>Mark all read</button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <p>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
