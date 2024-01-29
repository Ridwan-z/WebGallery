import React from 'react';
import './admin/css/sb-admin-2.css';
import './admin/css/sb-admin-2.min.css';

const Error = () => {
    return (
        <div className="container-fluid">
        {/* 404 Error Text */}
        <div className="text-center">
            <div className="error mx-auto" data-text={404}>404</div>
            <p className="lead text-gray-800 mb-5">Page Not Found</p>
        </div>
        </div>

    );
};

export default Error;