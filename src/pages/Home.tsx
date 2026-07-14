import { Canvas } from '@react-three/fiber'
import Footer from '../components/Footer'
// import { Model } from '../components/Home3d'
import { Suspense } from 'react'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Model } from '../components/Brake'
import Collection from '../components/Collection'

const Home = () => {

  return (
    <div className='w-full overflow-hidden'>
      {/* <Intro/> */}
      <div className='w-screen relative h-[80vh] overflow-hidden'>
        <div className="absolute top-[50%] z-10 left-[10%]">
          <h1 className="text-white text-4xl font-bold">First Auto</h1>
          <h3 className="text-white text-4xl font-bold">Spare Parts for your car</h3>
        </div>
        <Canvas
          className='w-full h-full bg-gradient-to-bl from-black to-gray-800'
          shadows
          dpr={[1, 2]}
          // Moved the camera much closer so a standard-sized model is visible
          camera={{ position: [2, 5, 5], fov: 70 }}
        >
          {/* Ambient light for subtle base illumination */}
          <ambientLight intensity={0.5} />

          {/* Directional Key Light acting like studio lighting */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.5}
            castShadow
            shadow-mapSize={2048}
          />

          {/* Soft fill light from the opposite side to handle harsh shadows */}
          <pointLight position={[-5, 3, -5]} intensity={1.5} />

          <Suspense fallback={null}>
            {/* The Model handles its own positioning */}
            <Model position={[0, -0.5, 0]} />

            {/* Environment preset handles realistic reflections on the bag's materials */}
            <Environment preset='studio' environmentIntensity={1.5} />

            {/* Dropping the shadow slightly below the model's Y base */}
            <ContactShadows position={[0, -0.51, 0]} opacity={0.6} scale={5} blur={2} far={2} />
          </Suspense>

          <OrbitControls
            enableZoom={true} // Enabled temporarily so you can adjust and find the perfect scale
            enablePan={false}
            enableRotate={true} // Enabled so you can test how materials reflect light from different angles
            autoRotate={true}
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
        {/* <Shop /> */}
      </div>
      {/* <CategoriesShow /> */}
      <Collection />
      {/* <BestSell /> */}
      <div className=" m-2 flex justify-center">

        {/* <Subscribe/> */}
      </div>
      <Footer />
    </div>
  )
}

export default Home;