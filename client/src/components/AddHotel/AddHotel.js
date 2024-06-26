import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import styles from "./AddHotel.module.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { hotelContext } from "../../store/HotelInfoProvider";
import ImagePicker from "../ImagePicker/ImagePicker";

const inputInfo = [
  { label: "Hotel Name", stateKey: "hotel" },
  { label: "Address", stateKey: "address" },
  { label: "City", stateKey: "city" },
  { label: "Contact Number", stateKey: "contactNumber" },
  { label: "Min Price", stateKey: "minPrice" },
  { label: "Max Price", stateKey: "maxPrice" },
  { label: "Category", stateKey: "category" },
  { label: "Star Rating", stateKey: "starRating" },
];

const AddHotel = () => {
  const initialState = {
    hotel: "",
    address: "",
    city: "",
    contactNumber: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    starRating: "",
  };

  const { fetchHotelData } = useContext(hotelContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [image, setImage] = useState();
  const [clearImage, setClearImage] = useState(false);

  const backToHotels = () => {
    navigate("/hotels");
  };

  const handleChange = (e, stateKey) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [stateKey]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("entered the function.", formData);

    // POST request
    try {
      const response = await fetch("http://localhost:5500/api/v1/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(formData), this will be wrong here.
        // Bcoz backend is expecting an object with keys hotelName,address...etc.
        body: JSON.stringify({
          hotelName: formData.hotel,
          address: formData.address,
          city: formData.city,
          contactNumber: formData.contactNumber,
          category: formData.category,
          starRating: formData.starRating,
          maxPrice: formData.maxPrice,
          minPrice: formData.minPrice,
          photo: image,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data:", data);

      // Fetching data again to render recently added hotel on homepage.
      fetchHotelData();
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log(formData);
    setFormData(initialState);
    setImage(null);
    setClearImage(true); // Trigger the clear image ref

    // using setTimeout to avoid batching of setState functions.
    setTimeout(() => setClearImage(false), 0); // Reset the state to allow future resets
    // navigate("/");
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
  };

  useEffect(() => {
    console.log(image);
  }, [image]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Button
          className={styles.showHotels}
          onClick={backToHotels}
          variant="contained"
          color="primary"
        >
          Show Hotels
        </Button>

        {/* <input type="file" onChange={imageUploadHandler} /> */}
        <form className={styles.form} onSubmit={submitHandler}>
          <ImagePicker
            onImageChange={handleImageChange}
            clearImage={clearImage}
          />
          {inputInfo.map((info, index) => (
            <TextField
              className={styles.input}
              key={index}
              value={formData[info.stateKey]}
              onChange={(e) => handleChange(e, info.stateKey)}
              required={true}
              id="outlined-basic"
              label={info.label}
              variant="outlined"
            />
          ))}
          <Button type="submit" variant="contained" color="primary">
            Add Hotel
          </Button>
        </form>
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default AddHotel;
