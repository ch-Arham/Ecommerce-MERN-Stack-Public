import React,{ useState, useEffect } from 'react'
import { useAlert } from 'react-alert'

// importing redux
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, resetPassword } from "../../action/userAction";

// importing components
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

// importing Material UI
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";

// importing styles
import "./ResetPassword.css";


// ResetPassword component ------------------------------------------------------
const ResetPassword = ({ history, match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.forgotPassword);

  // Use States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Use Effect
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");

      history.push("/login");
    }
  }, [dispatch, error, alert, history, success]);

  // Functions
  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('password', password);

    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(match.params.token, formData));
  }

  return (
    <>
        {loading ? <Loader /> : (
            <>
                <MetaData title="Change Password" />
                <div className="resetPasswordContainer">
                    <div className="resetPasswordBox">
                        <h2 className="resetPasswordHeading">Update Profile</h2>

                        <form 
                            className="resetPasswordForm"
                            onSubmit={resetPasswordSubmit}
                        >
                            <div>
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
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
                                value="Update"
                                className="resetPasswordBtn"
                            />

                        </form>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default ResetPassword