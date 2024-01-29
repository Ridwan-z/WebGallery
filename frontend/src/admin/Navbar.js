import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../auth/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const { logout, userName, authToken, fotoUser} = useAuth();

     const handleLogout = async () => {
        try {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
            headers: {
            Authorization: `Bearer ${authToken}`,
            },
        });

        logout(); // Call the logout function from AuthContext
        navigate('/login'); // Redirect to /login on successful logout
        } catch (error) {
        console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* ... your existing navbar code ... */}
            <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
                onClick={onToggleSidebar}
            >
                <i className="fa fa-bars"></i>
            </button>

            <form
                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                        aria-label="Search" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-dark" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>

            {/*  <!-- Topbar Navbar --> */}
            <ul className="navbar-nav ml-auto">

                {/*  <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw"></i>
                    </a>
                    {/*   <!-- Dropdown - Messages --> */}
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                        aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Search for..." aria-label="Search"
                                    aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>

                {/*  <!-- Nav Item - Alerts --> */}
                


                {/* <!-- Nav Item - User Information --> */}
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userName}</span>
                        <img className="img-profile rounded-circle"
                                    src={`http://localhost:8000/files/` + fotoUser}></img>
                       
                    </a>
                    {/*  <!-- Dropdown - User Information --> */}
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </a>
                        <div className="dropdown-divider"></div>
                        <button type='button' onClick={handleLogout} className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </button>
                    </div>
                </li>

            </ul>
            {/* ... your existing navbar code ... */}
        </nav>
    );
};

export default Navbar;