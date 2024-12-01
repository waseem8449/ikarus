import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import axios from "axios";

// Model component to load and render the 3D model
const Model = ({ modelUrl }) => {
  console.log('modelUrl', modelUrl);
  let url = modelUrl.split('-');
  const { scene, error, loading } = useGLTF(`/model/${url[1]}`);  // Use the URL to load the model

  if (error) {
    return <div style={{ color: "red" }}>Error loading model: {error.message}</div>;
  }

  return <primitive object={scene} scale={1} />;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [models, setModels] = useState([]); 
  const [modelUrl, setModelUrl] = useState(""); 
  const [error, setError] = useState(null);

  // Fetch models from the backend with search term filtering
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get("http://localhost:5000/models", {
          params: { search: searchTerm }, 
        });
        const fetchedModels = response.data;
        setModels(fetchedModels);
        if (fetchedModels.length > 0) {
          setModelUrl(fetchedModels[0].url); 
        }
      } catch (err) {
        console.error("Failed to fetch models:", err.message);
        setError(err.message || "Failed to fetch models.");
      }
    };

    fetchModels();
  }, [searchTerm]); // Re-fetch models when the search term changes

  return (
    <div className="app-container">
      <header style={{ padding: "5px", background: "#f4f4f4" }}>
        <input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          style={{
            padding: "4px",
            width: "200px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </header>
      {models.length > 0 && (
        <div>
          <h3>Available Models</h3>
          <ul>
            {models.map((model) => (
              <li key={model._id}>
                <span>{model.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
        <Canvas style={{ width: "100%", height: "100%" }}>
          {/* Add lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls />
          <Suspense
            fallback={
              <mesh>
                <boxGeometry />
                <meshStandardMaterial color="gray" />
              </mesh>
            }
          >
            {modelUrl && <Model modelUrl={modelUrl} />}
          </Suspense>
        </Canvas>
      </div>
    

      {/* Error message if any */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default App;
