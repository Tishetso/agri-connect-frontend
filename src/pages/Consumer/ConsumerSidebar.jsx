import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    MdStore,
    MdLocalFlorist,
    MdShoppingCart,
    MdChat,
    MdSettings,
    MdLogout,
    MdMenu,
    MdClose,
    MdDashboard
} from "react-icons/md";

function ConsumerSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    //get user data from local storage
    const user = JSON.parse(localStorage.getItem('user')) || {name: 'Consumer', role: 'consumer'};

    // Combine name and surname for full name display
    const fullName = user.surname ? `${user.name} ${user.surname}` : user.name;

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
                            <MdDashboard className="nav-icon" />
                            {!collapsed && "Dashboard"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consumer/marketplace">
                            <MdStore className="nav-icon" />
                            {!collapsed && "Marketplace"}
                        </NavLink>
                    </li>
                  {/*Added 2026-Jan-22*/}
                    <li>
                        <NavLink to="/consumer/cart" className={({isActive}) => isActive ? 'active-link' : ''}>
                            <MdShoppingCart className="nav-icon"/>
                            {!collapsed && "My Cart"}
                        </NavLink>

                    </li>
                    <li>
                        <NavLink to="/consumer/orders">
                            <MdShoppingCart className="nav-icon" />
                            {!collapsed && "My Orders"}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/consumer/garden" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdLocalFlorist className="nav-icon" />
                            {!collapsed && "Garden Planner"}
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
                            <h4 className="user-name">{fullName}</h4>
                            <p className="user-role">Consumer</p>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

export default ConsumerSidebar;