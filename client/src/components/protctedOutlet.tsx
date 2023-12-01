import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedOutlet = () => {

    const location = useLocation();
    const userId = localStorage.getItem("userId")
    return (
        <>
            {!userId && userId === '' ? (
                <>
                    <Navigate to="/login" state={{ from: location }} replace />
                </>
            ) : (
                <>
                    <Outlet />
                </>
            )}
        </>
    );
};

export default ProtectedOutlet;