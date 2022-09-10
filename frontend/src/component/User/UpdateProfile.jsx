import React,{ useState, useEffect } from 'react'
import { useAlert } from "react-alert";

// import redux
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, updateProfile, loadUser } from "../../action/userAction";

//import constants
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";

// import components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

// import material-ui components
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";

// import styles
import "./UpdateProfile.css";

// Update Profile Component ------------------------------------------------------
const UpdateProfile = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  // Use States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // useEffect
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
    } , [user]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Profile updated successfully");
            dispatch(loadUser());

            history.push("/account");

            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    } , [error, alert, dispatch, history, isUpdated, user]);

    // Functions
    const updateProfileSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        formData.set("name", name);
        formData.set("email", email);
        formData.set("avatar", avatar);
        dispatch(updateProfile(formData));
      };

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
              setAvatarPreview(reader.result);
              setAvatar(reader.result);
            }
        };
        
        reader.readAsDataURL(e.target.files[0]);
    };

  return (
    <>
        {loading ? <Loader /> : (
            <>
                <MetaData title="Update Profile" />
                <div className="updateProfileContainer">
                    <div className="updateProfileBox">
                        <h2 className="updateProfileHeading">Update Profile</h2>

                        <form
                            className="updateProfileForm"
                            encType="multipart/form-data"
                            onSubmit={updateProfileSubmit}
                        >
                            <div className="updateProfileName">
                            <FaceIcon />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            </div>
                            <div className="updateProfileEmail">
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

                            <div id="updateProfileImage">
                            <img src={avatarPreview} alt="Avatar Preview" />
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={updateProfileDataChange}
                            />
                            </div>
                            <input
                            type="submit"
                            value="Update"
                            className="updateProfileBtn"
                            />
                        </form>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default UpdateProfile