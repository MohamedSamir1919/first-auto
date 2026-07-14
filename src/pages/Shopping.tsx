import React from 'react'
import SaleBaner from '../components/SaleBaner'
import ShoppingShow from '../components/ShoppingShow'
import Footer from '../components/Footer'

type Props = {}

const Shopping = (props: Props) => {
  return (
    <div className='w-full'>
      <SaleBaner />
      <ShoppingShow />
      <Footer />
    </div>
  )
}

export default Shopping