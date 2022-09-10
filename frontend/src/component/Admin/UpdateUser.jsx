import React,{ useState, useEffect } from 'react';
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser, clearErrors } from "../../action/userAction";

// importing constants
import { UPDATE_USER_RESET } from "../../constants/userConstants";

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

// importing material ui components
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";
import { Button } from "@material-ui/core";


// ------------------ Update User Component ------------------
const UpdateUser = ({ history,match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const userId = match.params.id;

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: updateLoading, error: updateError, isUpdated } = useSelector(state => state.profile);

  // ------------------ useState Hooks ------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // ------------------ useEffect Hooks ------------------
    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('User updated successfully');
            history.push("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
            dispatch(getUserDetails(userId));
        }
    }, [dispatch, alert, error, history, updateError, isUpdated, userId, user]);

    // ------------------ Update User Handler ------------------
    const updateUserSubmitHandler = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        formData.set("name", name);
        formData.set("email", email);
        formData.set("role", role);
    
        dispatch(updateUser(userId, formData));
    };

  return (
    <>
        <MetaData title={"Update User"} />
        <div className="dashboard">
            <Sidebar />

            <div className="newProductContainer">
                {loading ? <Loader /> : (
                    <form 
                        className="createProductForm"
                        onSubmit={updateUserSubmitHandler}
                    >
                        <h1>Update User</h1>

                        <div>
                            <PersonIcon />
                            <input
                            type="text"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <MailOutlineIcon />
                            <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <VerifiedUserIcon />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Choose Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            </select>
                        </div>


                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={
                            updateLoading ? true : false || role === "" ? true : false
                            }
                        >
                            Update
                        </Button>
                    </form>
                )}
            </div>
        </div>
    </>
  )
}

export default UpdateUser