import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdStore, MdLocalFlorist, MdShoppingCart, MdChat, MdSettings, MdLogout, MdMenu, MdClose } from "react-icons/md";

function ConsumerSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            {/* Toggling button */}
            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <MdMenu /> : <MdClose />}
            </button>

            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/consumer" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdStore className="nav-icon" />
                            {!collapsed && "Marketplace"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consumer/garden" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdLocalFlorist className="nav-icon" />
                            {!collapsed && "Garden Planner"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consumer/orders">
                            <MdShoppingCart className="nav-icon" />
                            {!collapsed && "My Orders"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consumer/chatroom">
                            <MdChat className="nav-icon" />
                            {!collapsed && "Chatroom"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consumer/settings">
                            <MdSettings className="nav-icon" />
                            {!collapsed && "Settings"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/logout">
                            <MdLogout className="nav-icon" />
                            {!collapsed && "Logout"}
                        </NavLink>
                    </li>
                </ul>

                {/* User profile section */}
                <div className="user-profile">
                    <img src="/farmer.png" alt="User" className="profile-pic" />


                    {!collapsed && (
                        <div className="user-info">
                            <h4 className="user-name">Consumer Name</h4>
                            <p className="user-role">Consumer</p>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

export default ConsumerSidebar;