import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../../components/admin/Nav'
type Props = {}

const Adminlayout = (props: Props) => {

  return (
    <div className="flex">
      <div className="fixed h-[100%] z-[1999] top-0 left-0">
        <Nav />

      </div>
      <div className="w-[90%] ml-[100px] md:ml-0 flex justify-center z-[9]">
        <Outlet />
      </div>
    </div>
  )
}

export default Adminlayout