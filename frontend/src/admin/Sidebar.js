import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isToggled, onToggleSidebar }) => {
    const sidebarClass = isToggled
        ? "navbar-nav bg-gradient-dark sidebar sidebar-dark accordion toggled"
        : "navbar-nav bg-gradient-dark sidebar sidebar-dark accordion";

    const sidebarToggleClass = isToggled ? "toggled" : "";

    return (
        <ul className={sidebarClass} id="accordionSidebar">

            <Link to="/admin" className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-text mx-3">Web Gallery</div>
                <div className="text-center d-none d-md-inline"></div>
            </Link>

            <hr className="sidebar-divider my-0" />

            <li className="nav-item active">
                <Link to="/admin" className={`nav-link ${sidebarToggleClass}`}>
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <Link to="kategori" className={`nav-link ${sidebarToggleClass}`}>
                    <i className="bi bi-clipboard"></i>
                    <span>Kategori</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link to="gambar" className={`nav-link ${sidebarToggleClass}`}>
                    <i className="bi bi-image"></i>
                    <span>Gambar</span>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <Link to="/home" className={`nav-link ${sidebarToggleClass}`}>
                    <i className="bi bi-house"></i>
                    <span>Home</span>
                </Link>
            </li>

            {/* <div className='text-center my-3'>
                <button className={`rounded-circle border-0 ${sidebarToggleClass}`} id="sidebarToggle" onClick={onToggleSidebar}></button>
            </div> */}

        </ul>
    );
};

export default Sidebar;
