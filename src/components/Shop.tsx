import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Plane, Environment, useTexture, ContactShadows } from '@react-three/drei'
// ملحوظة: تأكد أن Three.js عندك تدعم الـ webgpu إذا كنت تستخدم هذا الـ Import، وإلا يمكنك حذفه لو مش مستخدم.
import { MeshToonNodeMaterial } from 'three/webgpu'
import Car from './Car'

// 1. تعريف الـ Props الخاصة بمكون Building
interface BuildingProps {
  onClick: (event: any) => void; // أو يمكنك كتابتها () => void طالما لا تستخدم حدث الـ click نفسه داخل المكون
}

const Building: React.FC<BuildingProps> = ({ onClick }) => {
  // const texture = useTexture("/mosasha/odisha.jpeg")

  return (
    <group onClick={onClick}>
      {/* 1. الأرضية المحيطة (رصيف) */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial
          // map={texture}
          transparent={false}
        />
      </Plane>

      {/* 2. جسم الكشك الأساسي */}
      <Box args={[4, 3, 3]} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      {/* 3. السقف (ممتد قليلاً للأمام كظلال) */}
      <Box args={[4.4, 0.2, 3.4]} position={[0, 3, 0]} castShadow>
        <meshStandardMaterial color="#e67e22" />
      </Box>

      {/* 4. فتحة النافذة (Display Window) */}
      <group position={[0, 1.6, 1.51]}>
        {/* إطار النافذة */}
        <Box args={[3, 1.8, 0.1]}>
          <meshPhysicalMaterial
            transparent
            opacity={0.4}
            roughness={0}
            metalness={1}
            color="#81ecec"
          />
        </Box>

        {/* الرف الداخلي الظاهر من النافذة */}
        <group position={[0, -0.5, -0.5]} scale={0.5}>
          <Box args={[4, 0.1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#fff" />
          </Box>
          {/* الشورتات على الرف */}
          <Box args={[0.8, 0.2, 0.6]} position={[-0.8, 0.2, 0]}>
            <meshStandardMaterial color="#3498db" />
          </Box>
          <Box args={[0.8, 0.2, 0.6]} position={[0.8, 0.2, 0]}>
            <meshStandardMaterial color="#e74c3c" />
          </Box>
        </group>
      </group>

      {/* 5. قاعدة الكشك (Slab) */}
      <Box args={[4.2, 0.2, 3.2]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#111" />
      </Box>

      {/* 6. لافتة صغيرة جانبية */}
      <Box args={[0.1, 1, 0.6]} position={[2.05, 2, 0.5]}>
        <meshStandardMaterial color="#f1c40f" />
      </Box>
    </group>
  )
}

export default function Shop() {
  // 2. تحديد نوع الـ useState ليكون boolean وإعطائه قيمة ابتدائية (false) منعاً للـ undefined خطأ عند أول رندر
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)

    // تشغيل الفحص لأول مرة عند التحميل
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <Canvas shadows camera={{ position: [6, 0, 8], fov: isMobile ? 70 : 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Building onClick={() => { }} />
        <Car />
        <Environment preset="city" />
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />

        <OrbitControls
          enableZoom={false}      // تعطيل التقريب
          enablePan={false}       // تعطيل التحريك الجانبي
          enableRotate={false}    // تعطيل تدوير المستخدم
          autoRotate={true}       // تفعيل الدوران التلقائي
          autoRotateSpeed={2}     // سرعة الدوران
          minPolarAngle={Math.PI / 3} // تثبيت زاوية الارتفاع
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  )
}