import React from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

type Props = {
    title:string;
    quantity:number;
    target:number;
    achieved:number;
}

const Wedgit = (props: Props) => {
  return (
    <div className="w-[200px] flex  flex-col shadow-2xl rounded-2xl p-4">
      <div className="flex w-full flex-col text-2xl  justify-center items-center">
        monthly
        <hr className="w-[100px] h-[1px] bg-black"/>
      </div>
<div className="w-full flex justify-between">

        <div className="font-black text-lg">{props.title}</div>
        <p>{props.quantity} {props.title == "Income" ? <span className=''>EGP</span>: ""}</p>
</div>

<div className="w-full flex justify-between">
<div className="font-black text-lg">Target: </div>
<p >{props.target} {props.title == "Income" ? <span className=''>EGP</span>: ""}</p>
</div>
<div className="w-full flex justify-between">
<div className="font-black text-lg">new: </div>
<p >{props.achieved} {props.title == "Income" ? <span className=''>EGP</span>: ""}</p>
</div>

<div className="w-full flex justify-end">
{props.target <= props.achieved 
? <FaCaretUp  className="text-[green]"/>:<FaCaretDown  className="text-[red]" />}

</div>
    </div>
  )
}

export default Wedgit