
// @ts-nocheck
import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet, useSearchParams } from 'react-router-dom'


type Props = {}

const HomeLayout = () => {

  return (
    <div className='w-full relative flex flex-col justify-center items-center'>
      <Navbar />
      {/* THE PAGE */}
      <div className='w-full'>
        <Outlet />

      </div>
    </div>
  )
}

export default HomeLayout;