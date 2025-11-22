import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdList, MdNotifications, MdChat, MdSettings, MdLogout, MdMenu, MdClose } from "react-icons/md";

function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
         {/*toggling button*/}
            <button className = "toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <MdMenu /> : <MdClose />}
            </button>

            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/farmer" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdDashboard className="nav-icon" />
                            {!collapsed && "Dashboard"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/farmer/listings">
                            <MdList className="nav-icon" />
                            {!collapsed && "My Listings"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/farmer/alerts">
                            <MdNotifications className="nav-icon" />
                            {!collapsed && "Alerts"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/farmer/chatroom">
                            <MdChat className="nav-icon" />
                            {!collapsed && "Chatroom"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings">
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


            </nav>
        </aside>
    );
}

export default Sidebar;
