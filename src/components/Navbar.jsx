import logo from "../assets/Images/logo.svg"
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Nav() {

    
    const [toggle, setToggle] = useState(true)
    
    return (
        <>
        <header className="h-20 bg-[#181617]">
            <nav className=" flex items-center justify-between px-12 h-10 md:flex md:items-center md:justify-between">
                <div className="flex items-center pt-5">
                    <a href="#"><img className="grayscale w-12 pt-3"src={logo} alt="RGE logo"/></a>
                    <a className="text-white font-montserrat pt-2">RGE global</a>
                </div>
              
                
                
                
               
                
                {toggle && (
                    <div className="absolute h-[100vh] top-[59px] left-0 bg-white w-full flex flex-col gap-5 items-center font-bold">
                    <ul className="flex flex-col items-center gap-6 text-red-500 uppercase tracking-wider md:flex md:items-end ">
                   <li className=" md:p-10 ">About</li>
                   <li className="md:p-10">Sermons</li>
                   <li className=" md:p-10">Leadership</li>
                   <li className="md:p-10 md:place-items-end">Give</li> 
                   </ul>
                    </div>
                    )}
                <button onClick={()=>setToggle(!toggle)}
                className="text-4xl lg:hidden md:hidden text-white pt-5">
                    ☰
                </button>
                
            </nav>
        </header>
        </>
    )
}