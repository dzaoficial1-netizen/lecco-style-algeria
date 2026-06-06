import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

interface ViewerProduct {
  category: string;
  colors: string[];
}

function Shape({ p, hex }: { p: ViewerProduct; hex: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });

  const mat = (
    <meshPhysicalMaterial
      color={hex}
      metalness={0.35}
      roughness={0.25}
      clearcoat={0.8}
      clearcoatRoughness={0.2}
      sheen={1}
      sheenColor={hex}
    />
  );

  const cat = p.category;
  if (cat === "sneakers" || cat === "sandals") {
    return (
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[0.75, 0.26, 180, 32]} />
        {mat}
      </mesh>
    );
  }
  if (cat === "hats") {
    return (
      <mesh ref={ref} castShadow>
        <torusGeometry args={[0.9, 0.3, 32, 100]} />
        {mat}
      </mesh>
    );
  }
  if (cat === "jackets" || cat === "hoodies") {
    return (
      <mesh ref={ref} castShadow rotation={[0.3, 0.5, 0]}>
        <icosahedronGeometry args={[1.05, 1]} />
        {mat}
      </mesh>
    );
  }
  if (cat === "pants") {
    return (
      <mesh ref={ref} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.7, 64]} />
        {mat}
      </mesh>
    );
  }
  // tshirts, shirts, default
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 96, 96]} />
      {mat}
    </mesh>
  );
}

export function Product3DViewer({ p, color }: { p: ViewerProduct; color: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hex = /^#?[0-9a-f]{3,8}$/i.test(color) ? color : "#0A0A0A";

  return (
    <div className="relative h-56 md:h-64 bg-gradient-to-br from-secondary via-paper to-secondary border border-border overflow-hidden cursor-grab active:cursor-grabbing">
      <div className="absolute top-3 left-3 z-10 eyebrow text-[0.6rem] text-muted-foreground pointer-events-none">
        Drag · 3D Preview
      </div>
      <div className="absolute top-3 right-3 z-10 eyebrow text-[0.6rem] text-brand pointer-events-none">
        ● Live
      </div>
      {mounted && (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.2, 3.4], fov: 40 }}>
          <color attach="background" args={["#fafafa"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 3]} intensity={1.2} castShadow />
          <Suspense fallback={<Html center><span className="eyebrow text-muted-foreground">Loading…</span></Html>}>
            <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.7}>
              <Shape p={p} hex={hex} />
            </Float>
            <ContactShadows position={[0, -1.3, 0]} opacity={0.45} scale={6} blur={2.5} far={2} />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
        </Canvas>
      )}
    </div>
  );
}