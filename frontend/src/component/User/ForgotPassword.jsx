import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../action/userAction";

// importing constants
import { FORGOT_PASSWORD_RESET } from "../../constants/userConstants";

// importing components
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

// importing Material UI
import MailOutlineIcon from "@material-ui/icons/MailOutline";

// importing styles
import "./ForgotPassword.css";



// Forgot Password Component
const ForgotPassword = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );

  // Use States
  const [email, setEmail] = useState("");

  // Use Effect
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);
      setEmail("");
      dispatch({ type: FORGOT_PASSWORD_RESET });
      history.push("/login");
    }
  }, [dispatch, error, alert, message, history]);

  // Function
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("email", email);

    dispatch(forgotPassword(formData));
  
  }

  return (
    <>
        {loading ? <Loader /> : (
            <>
                <MetaData title="Forgot Password" />
                <div className="forgotPasswordContainer">
                    <div className="forgotPasswordBox">
                        <h2 className="forgotPasswordHeading">Forgot Password</h2>

                        <form
                            className="forgotPasswordForm"
                            onSubmit={forgotPasswordSubmit}
                        >
                            <div className="forgotPasswordEmail">
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <input
                                type="submit"
                                value="Send"
                                className="forgotPasswordBtn"
                            />
                        </form>
                    </div>
                </div>
            </>
    )}
    </>
  )
};

export default ForgotPassword;
