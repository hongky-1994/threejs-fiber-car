import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./Model";
import "./App.css";
import { Vector3 } from "three";
// import Overlay from "./Overlay";

export default function App() {
  const [isFocus, setIsFocus] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);

  const handleLoseFocus = () => {
    setIsFocus(false);
    setTargetPosition(null);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Canvas shadows eventPrefix="client">
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model
            isFocus={isFocus}
            targetPosition={targetPosition}
            setIsFocus={setIsFocus}
            setTargetPosition={setTargetPosition}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <button
        style={{
          display: !isFocus ? "none" : "flex",
          position: "fixed",
          left: 20,
          bottom: 20,
          borderRadius: 9999,
          width: 100,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          background: "gold",
        }}
        onClick={handleLoseFocus}
      >
        Back
      </button>
    </div>
  );
}
