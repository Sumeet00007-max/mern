import React from "react";
import styles from "./Sidebar.module.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <img src={logo} alt="logo" />

      <div className={styles.menu}>
        <ul>
          <li>
            <Link to="/">
              <img src="/home.png" alt="home" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/links">
              <img src="/link.png" alt="link" />
              <span>Links</span>
            </Link>
          </li>
          <li>
            <Link to="/analytics">
              <img src="/analytics.png" alt="link" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <img src="/setting.png" alt="link" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
