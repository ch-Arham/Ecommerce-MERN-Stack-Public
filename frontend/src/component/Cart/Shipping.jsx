import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { Country, State } from "country-state-city";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../action/cartAction";

// importing components
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

// importing material ui components
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";

// importing styles
import "./Shipping.css";


// Shipping Component ----------------------------------------------------------
const Shipping = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);

  // Use States
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  // Functions
  const shippingSubmit = (e) => {
    e.preventDefault();
    if (address.length < 3) {
      alert.error("Address must be at least 3 characters");
    } else if (address.length > 100) {
        alert.error("Address must be at most 100 characters");
    } else if (city.length < 3) {
        alert.error("City must be at least 3 characters");
    } else if (city.length > 100) {
        alert.error("City must be at most 100 characters");
    } else if (pinCode.length < 5) {
        alert.error("Pin Code must be at least 5 digits");
    } else if (pinCode.length > 6) {
        alert.error("Pin Code must be at most 6 digits");
    } else if (phoneNo.length < 10) {
        alert.error("Phone No must be at least 10 digits");
    } else if (phoneNo.length > 15) {
        alert.error("Phone No must be at most 15 digits");
    } else if (country === "") {
        alert.error("Country is required");
    } else if (state === "") {
        alert.error("State is required");
    } else { 
        const tempPinCode = parseInt(pinCode); // might need to change this
        const tempPhoneNo = parseInt(phoneNo);
        dispatch(
            saveShippingInfo({ address, city, state, country, pinCode: tempPinCode, phoneNo: tempPhoneNo })
        );
        history.push("/order/confirm");
    }
  };

  return (
    <>
        <MetaData title="Shipping Details" />

        <CheckoutSteps activeStep={0} />

        <div className="shippingContainer">
            <div className="shippingBox">
                <h2 className="shippingHeading">Shipping Details</h2>

                <form
                    className="shippingForm"
                    encType="multipart/form-data"
                    onSubmit={shippingSubmit}
                >
                    <div>
                        <HomeIcon />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>


                    <div>
                        <LocationCityIcon />
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>


                    <div>
                        <PinDropIcon />
                        <input
                            type="number"
                            placeholder="Pin Code"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                        />
                    </div>


                    <div>
                        <PhoneIcon />
                        <input
                            type="number"
                            placeholder="Phone Number"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            size="10"
                        />
                    </div>


                    <div>
                        <PublicIcon />
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option value="">Country</option>
                            {Country &&
                            Country.getAllCountries().map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                {item.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    {country && (
                        <div>
                            <TransferWithinAStationIcon />

                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                            <option value="">State</option>
                            {State &&
                                State.getStatesOfCountry(country).map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </div>
                    )}


                    <input
                        type="submit"
                        value="Continue"
                        className="shippingBtn"
                    />
                </form>
            </div>
        </div>
    </>
  )
}

export default Shipping