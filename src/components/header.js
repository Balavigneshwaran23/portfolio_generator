import { Bars3Icon } from '@heroicons/react/24/solid'
import React from 'react';
import { useState } from 'react'
import { HomeIcon, UserIcon, LightBulbIcon, BriefcaseIcon, PhoneIcon } from '@heroicons/react/24/outline'; 
export default function Header (){
    const[togglebnt ,settogglebnt] = useState(false);



    return<header className="  flex fixed w-full bg-black justify-between text-white px-5 py-2 ">
        <a href='https://github.com/BALAVIGNESHWARAN23' id="home" className='z-10 '><h2 className=" font-bold text-3xl  font-boldfont hover:text-orange-500  text-white  ">B<span className='hover:text-white text-orange-500 '>V</span></h2></a>
        <nav className='hidden relative  md:block portnav'>
        <ul className=" flex  z-50 font-bold text-xl font-modernfont">
        <li className="flex hover:text-blue-500 duration-300"><a href="/">dashboard</a></li>
            <li className="flex hover:text-blue-500 duration-300"><a href="#Example">Example</a></li>
            <li className="flex hover:text-blue-500 duration-300"><a href="#template">template</a></li>
            <li className="flex hover:text-blue-500 duration-300"><a href="#prices">prices</a></li>


            <li className="flex relative left-1/2  hover:text-blue-500 duration-300"><a href="#contact">Login</a></li>

            <a href="#template"><button className=" flex relative left-[380px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full -mt-1">
      Get started — it's free
    </button></a>
        </ul></nav>
      { togglebnt &&  <nav className=' block md:hidden  '>
        <ul className="flex flex-col font-bold text-black duration-300 mobilnav animate-fade-in-right" onClick={() => settogglebnt(!togglebnt)}>
  <li className="flex justify-center items-center hover:text-blue-950 "><a href="/">dashboard</a></li>
  <li className="flex justify-center items-center hover:text-blue-950 "><a href="#Example">Example</a></li>
  <li className="flex justify-center items-center hover:text-blue-950 "><a href="#template">template</a></li>
  <li className="flex justify-center items-center hover:text-blue-950 "><a href="#prices">prices</a></li>
  <li className="flex justify-center items-center hover:text-blue-950 "><a href="#Account">Account</a></li>

  </ul>
 </nav>}
        <button onClick={()=> settogglebnt(!togglebnt)}><Bars3Icon  className=' fixed right-6 top-4 block md:hidden mobilnav1 text-white h-5 '/></button>
    </header>
}