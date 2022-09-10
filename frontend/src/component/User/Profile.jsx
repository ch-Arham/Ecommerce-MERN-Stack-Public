import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

// importing redux
import { useSelector } from "react-redux";

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

// importing styles
import "./Profile.css";

const Profile = ({ history }) => {
  // Use States
  const { user, loading, isAuthenticated  } = useSelector(state => state.user);

  // Use Effect
  useEffect(() => {
    if (isAuthenticated === false) {
        history.push("/login");
    }
  },[history, isAuthenticated]);


  return (
    <>
        {loading ? (
            <>
                <Loader />
                <MetaData title="User's Profile" />
            </>
            ) : (
            <>
                <MetaData title={`${user?.name}'s Profile`} />
                <div className="profileContainer">
                    <div>
                        <h1>My Profile</h1>
                        <img src={user?.avatar?.url} alt={user?.name} />
                        <Link to="/me/update">Edit Profile</Link>
                    </div>

                    <div>
                        <div>
                            <h4>Full Name</h4>
                            <p>{user?.name}</p>
                        </div>

                        <div>
                            <h4>Email</h4>
                            <p>{user?.email}</p>
                        </div>

                        <div>
                            <h4>Joined On</h4>
                            <p>{String(user?.createdAt).substr(0, 10)}</p>
                        </div>

                        <div>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default Profile