import { GroupProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Model(props: GroupProps) {
  const { nodes, materials } = useGLTF('/mosasha/scene-transformed.glb') as any
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Grid.geometry} material={materials['Material.013']} position={[10.434, 8.699, -5.392]} scale={33.608} />
      <group position={[17.005, 17.472, -5.408]} scale={[13.767, 8.475, 22.195]}>
        <mesh geometry={nodes.Cube001.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials['Material.006']} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials['Material.007']} />
        <mesh geometry={nodes.Cube001_3.geometry} material={materials['Material.008']} />
      </group>
      <mesh geometry={nodes.Cylinder.geometry} material={nodes.Cylinder.material} position={[1.333, 14.644, -10.288]} rotation={[0, 0, -Math.PI / 2]} scale={0.488} />
      <mesh geometry={nodes.gothic_coffee_table.geometry} material={materials.gothic_coffee_table} position={[-13.739, 8.405, 8.08]} scale={6.534} />
    </group>
  )
}

useGLTF.preload('/mosasha/scene-transformed.glb')
