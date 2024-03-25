import { /* OrbitControls */ PerspectiveCamera } from "@react-three/drei";
import { ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector2, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as Three from "three";

type Props = {
  isFocus: boolean;
  targetPosition: Vector3 | null;
  setIsFocus: (value: boolean) => void;
  setTargetPosition: (value: Vector3 | null) => void;
};

const Model = ({
  isFocus,
  targetPosition,
  setIsFocus,
  setTargetPosition,
}: Props) => {
  const truck = useLoader(GLTFLoader, "/Truck Armored.glb");
  const truck2 = useLoader(GLTFLoader, "/Pickup Truck Armored.glb");
  const sportCar = useLoader(GLTFLoader, "/Sports Car.glb");

  const [isFocusingTarget, setIsFocusingTarget] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [prevMousePos, setPrevMousePos] = useState(new Vector2());
  const { camera } = useThree();
  // const orbitRef = useRef(null);
  const sportCarRef = useRef<Three.Group>(null);
  const truckRef = useRef<Three.Group>(null);
  const truck2Ref = useRef<Three.Group>(null);

  const handleMouseDown = (event: ThreeEvent<PointerEvent>) => {
    setMouseDown(true);
    setPrevMousePos(new Vector2(event.clientX, event.clientY));
  };

  const handleMouseMove = (event: ThreeEvent<PointerEvent>) => {
    if (mouseDown && !isFocusingTarget) {
      const newPos = new Vector2(event.clientX, event.clientY);
      const delta = newPos.clone().sub(prevMousePos);
      const newX = camera.position.x - delta.x * 0.02;
      if (newX < -6.7 && newX > -21) {
        camera.position.x -= delta.x * 0.02;
      }
      setPrevMousePos(newPos);
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  useEffect(() => {
    if (!isFocus && !targetPosition) {
      setIsFocusingTarget(true);
    }
  }, [camera, isFocus, targetPosition]);

  useFrame(() => {
    if (!isFocus) {
      // Move the mesh in a circular path
      const time = performance.now() / 1000; // Convert time to seconds
      const radius = 2;
      const x = (Math.cos(time) * radius) / 2;
      const z = Math.sin(time) * radius;
      if (sportCarRef.current) {
        (sportCarRef.current as Three.Group).position.set(-10, 0, z);
      }
      if (truck2Ref.current) {
        (truck2Ref.current as Three.Group).position.set(x, 0, 10);
      }
    }

    if (mouseDown) return;

    if (!targetPosition && !isFocus && isFocusingTarget) {
      const targetPosition = new Vector3(-12.04635, 13.74319, 14.57299);
      camera.position.lerp(new Vector3(-12.04635, 13.74319, 14.57299), 0.05);

      const targetDirection = new Vector3()
        .subVectors(camera.position, targetPosition)
        .normalize();
      const currentDirection = camera.getWorldDirection(new Vector3());
      const newDirection = currentDirection.lerp(targetDirection, 0.05); // Adjust the value for speed

      camera.lookAt(camera.position.clone().add(newDirection));

      const distanceToTarget = camera.position.distanceTo(targetPosition);
      if (distanceToTarget < 0.3) {
        setIsFocusingTarget(false);
      }
    }

    if (isFocus && targetPosition && isFocusingTarget) {
      camera.position.lerp(
        targetPosition.clone().add(new Vector3(-5, 3, 5)),
        0.08
      ); // Move the camera 5 units behind the target

      const distanceToTarget = camera.position.distanceTo(targetPosition);

      const targetDirection = new Vector3()
        .subVectors(targetPosition, camera.position)
        .normalize();
      const currentDirection = camera.getWorldDirection(new Vector3());
      const newDirection = currentDirection.lerp(targetDirection, 0.05); // Adjust the value for speed

      camera.lookAt(camera.position.clone().add(newDirection));

      if (distanceToTarget < 0.3) {
        setIsFocusingTarget(false);
      }
    }
  });

  const handleClickTruck = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation(); // Prevent OrbitControls from handling the click
    const clickedMeshPosition = new Vector3();
    const ref = truckRef.current as Three.Group;
    ref.getWorldPosition(clickedMeshPosition);
    setTargetPosition(clickedMeshPosition.clone());
    setIsFocus(true);
    setIsFocusingTarget(true);
  };

  return (
    <>
      <group>
        <group position={[-10, 0, 0]} ref={sportCarRef}>
          <primitive object={sportCar.scene} />
        </group>
        <group position={[0, 0, 0]} ref={truckRef} onClick={handleClickTruck}>
          <primitive object={truck.scene} />
        </group>
        <group position={[10, 0, 0]} rotation-y={-Math.PI / 2} ref={truck2Ref}>
          <primitive object={truck2.scene} />
        </group>
        {/* <OrbitControls
          makeDefault
          position={[-4.609012477445206, 2.2690351028422127, 2.810466404600713]}
        /> */}
        <PerspectiveCamera
          makeDefault
          position={[-12.04635, 13.74319, 14.57299]}
          far={200}
          near={1}
          fov={60}
          rotation={[-0.80652, -0.47567, -0.44565]}
        ></PerspectiveCamera>
      </group>
      <mesh
        position={[0, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      >
        <planeGeometry args={[40, 40]}></planeGeometry>
        <meshStandardMaterial color="#fdfdfd"></meshStandardMaterial>
      </mesh>
    </>
  );
};

export default Model;
