import React, { useState, useEffect } from "react";
import axios from "axios";


const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/get-all-results/");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means the effect runs once after the first render

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const response = await fetch("http://localhost:8000/upload-photo/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const resp = await response.json();
          console.log("Upload successful", resp);

          // Add a small delay before fetching updated results
          setTimeout(() => {
            fetchData();
            console.log("Fetching updated results")
          }, 500); // Adjust the delay time as needed
        } else {
          console.error("Upload failed", response.statusText);
          // Handle the error
        }
      } catch (error) {
        console.error("Error uploading image", error);
        // Handle the error
      }
    } else {
      console.error("No image selected");
      // Handle the case where no image is selected
    }
  };

  return (
    <div>
      <h1>Cloud Image Sharing with AI Classification!</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Photo</button>
      <h1>Object Detection Results</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {results.map((result, index) => (
          <div key={index} style={{ margin: "10px", textAlign: "center" }}>
            <img
              src={`${result.image_url}?${Date.now()}`}  // Add a unique query parameter to prevent caching
              alt={`Result ${index}`}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            <p>Result {index}</p>
            <ul>
              {Object.keys(result)
                .filter(key => key !== "image_url")
                .map(item => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;














// import React, { useState } from "react";
// import "./App.css";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "./firebase-config";

// function App() {
//   const [imageUpload, setImageUpload] = useState();

//   const uploadFile = () => {
//     if (!imageUpload) return;

//     const imageRef = ref(storage, `./images/${imageUpload.name}`);

//     uploadBytes(imageRef, imageUpload).then((snapshot) => {
//       getDownloadURL(snapshot.ref).then((url) => {
//         console.log(url);
//       });
//     });
//   };

//   return (
//     <div className="App">
//       <input
//         type="file"
//         onChange={(event) => {
//           setImageUpload(event.target.files[0]);
//         }}
//       />
//       <button onClick={uploadFile}>Upload</button>
//     </div>
//   );
// }

// export default App;