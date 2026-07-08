import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdList,
    MdNotifications,
    MdChat,
    MdSettings,
    MdLogout,
    MdMenu,
    MdClose,
    MdShoppingCart
} from "react-icons/md";
import {getAvatarUrl} from "../../src/utils/avatarUrl";

function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);

    //get user data from localstorage
    const user = JSON.parse(localStorage.getItem('user')) || {name: 'Farmer', surname: '', role: 'farmer'};

    const fullName = user.surname ? `${user.name} ${user.surname}` : user.name;

    const [avatarUrl, setAvatarUrl] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return getAvatarUrl(user);
    });

    useEffect(() => {
        const handleUserUpdate = () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setAvatarUrl(getAvatarUrl(user));
        };

        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);

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
                        <NavLink to="/farmer/listings" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdList className="nav-icon" />
                            {!collapsed && "My Listings"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/farmer/orders" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <MdShoppingCart className="nav-icon" />
                            {!collapsed && "Orders"}
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
                        <NavLink to="/farmer/settings">
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

                {/*add a user profile*/}
                <div className="user-profile">

                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User" className="profile-pic" />
                    ) : (
                        <div className="profile-pic" style={{
                            background: '#e8f0fe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, color: '#3b5bdb', fontSize: 18,
                        }}>
                            {`${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase()}
                        </div>
                    )}

                    {!collapsed && (
                        <div className="user-info">
                            <h4 className="user-name"> {fullName}</h4>
                            <p className="user-role">Farmer</p>
                        </div>

                    )}

                </div>


            </nav>
        </aside>
    );
}

export default Sidebar;
