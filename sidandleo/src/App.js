import React, { useState, useEffect } from "react";
import axios from "axios";

// Your Firebase configuration (assuming this is in a separate file, e.g., firebase.js)
import { auth, db, storage } from "./firebase-config"; 

const App = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/get-all-results/");
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs once after the first render

  return (
    <div>
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