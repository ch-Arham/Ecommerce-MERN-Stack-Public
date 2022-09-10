import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../action/userAction";

// importing constants
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants"

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

// importing material-ui components
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

// importing styles
import "./UpdatePassword.css";


// Update Password Component
const UpdatePassword = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  // Use State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // useEffect
  useEffect(() => {
    if (error) {
        alert.error(error);
        dispatch(clearErrors());
    }

    if (isUpdated) {
        alert.success("Profile updated successfully");

        history.push("/account");

        dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  } , [error, alert, dispatch, history, isUpdated]);


  // Function
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert.error("Password not match");
    } else {
        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);
    
        dispatch(updatePassword(myForm));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
