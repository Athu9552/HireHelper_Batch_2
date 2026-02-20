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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
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

    const fetchNotifications = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
              axios.get('http://localhost:5000/api/notifications', {
                headers: { 'x-auth-token': token }
              }),
              axios.get('http://localhost:5000/api/notifications/unread-count', {
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
    return () => clearInterval(interval);

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleOpenNotifications = () => {
    setShowNotif((prev) => !prev);
  };

  const markAllNotificationsRead = async () => {
    if (notifications.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { 'x-auth-token': token } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const markNotificationRead = async (notificationId) => {
    const target = notifications.find((n) => n._id === notificationId);
    if (!target || target.read) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read',
        { notificationId },
        { headers: { 'x-auth-token': token } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark notification as read");
    }
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
                <div className="notification-bell" onClick={handleOpenNotifications}>
                    <FiBell />
                    {unreadCount > 0 && <span className="notif-dot"></span>}
                    {showNotif && (
                      <div className="notif-dropdown">
                        <div className="notif-header">
                          <span>Notifications</span>
                          {notifications.length > 0 && (
                            <button
                              type="button"
                              className="notif-mark-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllNotificationsRead();
                              }}
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="notif-list">
                          {notifications.length === 0 && (
                            <p className="notif-empty">You’re all caught up.</p>
                          )}
                          {notifications.map((n) => (
                            <button
                              key={n._id}
                              type="button"
                              className={`notif-item ${n.read ? 'read' : 'unread'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationRead(n._id);
                              }}
                            >
                              <p>{n.message}</p>
                              <span className="notif-time">
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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