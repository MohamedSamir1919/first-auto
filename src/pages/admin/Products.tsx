import React, { useEffect, useState } from 'react'
import data from '../../fakeData.json'
import ProductTable from '../../components/admin/ProductTable';
type Props = {}

type IItem ={
    id:number;
    title:string;
    description:string;
    stock:number;
    slug:string;
    img:string;
    colors:string[];
    size:string[];
     price:number;
     category:string;
}
const Products = (props: Props) => {
 
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <div className="mt-[50px] ml-[100px]">
       <ProductTable/>
        </div>
        
    </div>
  )
}

export default Products