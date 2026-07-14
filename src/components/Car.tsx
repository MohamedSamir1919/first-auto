import React from 'react'
import { Box, Cylinder } from '@react-three/drei'

const Car = ({ color = "#d35400", ...props }) => {
  return (
    <group {...props} position={[-3,0,-5]}>
      {/* 1. Lower Body */}
      <Box args={[2, 0.5, 1]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>

      {/* 2. Upper Body (Cabin) */}
      <Box args={[1.1, 0.5, 0.9]} position={[-0.1, 0.9, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>

      {/* 3. Windows (Front & Side) */}
      <Box args={[0.5, 0.35, 0.91]} position={[0.25, 0.9, 0]}>
        <meshStandardMaterial color="#222" transparent opacity={0.8} />
      </Box>

      {/* 4. Wheels */}
      {/* Front Left */}
      <Wheel position={[0.6, 0.2, 0.5]} />
      {/* Front Right */}
      <Wheel position={[0.6, 0.2, -0.5]} />
      {/* Back Left */}
      <Wheel position={[-0.6, 0.2, 0.5]} />
      {/* Back Right */}
      <Wheel position={[-0.6, 0.2, -0.5]} />

      {/* 5. Headlights */}
      <Box args={[0.1, 0.15, 0.2]} position={[1, 0.45, 0.3]}>
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
      </Box>
      <Box args={[0.1, 0.15, 0.2]} position={[1, 0.45, -0.3]}>
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
      </Box>
    </group>
  )
}

// Reusable Wheel Component
const Wheel = ({ position }) => (
  <Cylinder 
    args={[0.25, 0.25, 0.2, 16]} 
    position={position} 
    rotation={[Math.PI / 2, 0, 0]} 
    castShadow
  >
    <meshStandardMaterial color="#111" />
  </Cylinder>
)

export default Car;