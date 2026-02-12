import { useState } from "react";
import "./Dashboard.css";

import Feed from "./Sections/Feed";
import MyTasks from "./Sections/MyTask";
import Requests from "./Sections/Requests";
import MyRequests from "./Sections/MyRequests";
import AddTask from "./Sections/AddTask";
import Settings from "./Sections/Settings";

const Dashboard = () => {
  const [active, setActive] = useState("Feed");
  const [open, setOpen] = useState(true);

  const pages = {
    Feed: <Feed />,
    "My Tasks": <MyTasks />,
    Requests: <Requests />,
    "My Requests": <MyRequests />,
    "Add Task": <AddTask />,
    Settings: <Settings />
  };

  const menu = Object.keys(pages);

  return (
    <div className="dash-wrapper">

      <aside className={open ? "sidebar" : "sidebar close"}>
        <h2 className="logo">Hire Helper</h2>

        {menu.map((item, i) => (
          <div
            key={i}
            className={`menu-item ${active === item ? "active" : ""}`}
            onClick={() => setActive(item)}
          >
            {open ? item : item[0]}
          </div>
        ))}
      </aside>

      <section className="main">

        <header className="navbar">
          <h3>{active}</h3>
          <img src="https://i.pravatar.cc/40" alt="profile" className="avatar"/>
        </header>

        <div className="page">
          {pages[active]}
        </div>

      </section>
    </div>
  );
};

export default Dashboard;