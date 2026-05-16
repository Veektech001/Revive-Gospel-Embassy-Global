import { Link } from "react-router-dom";

export default function Afterhero() {
    return(
        <>
        <div className=" flex flex-col bg-cover bg-center h-[410px]  text-center p-5 bg-[url(./assets/Images/AHBI.jpg)] md:flex-row md:h-[150px] md:pl-[200px]">
            <ul className="pt-10 gap-4 flex flex-col ">
                <li className=""><a className=" bg-[#020202] text-white px-6 py-3 rounded-full text-base  font-bold hover:bg-[#000858] transition ">About</a></li>
                <li><a className="inline-block bg-[#020202] text-white px-7 py-3 rounded-full text-base font-semibold hover:bg-[#000858] transition">Recent Sermons</a></li>
                <li><a className="inline-block bg-[#020202] text-white px-12 py-3 rounded-full text-base font-semibold hover:bg-[#000858] transition">Leadership</a></li>
                <li><a className="inline-block bg-[#020202] text-white px-12 py-3 rounded-full text-base font-semibold hover:bg-[#000858] transition">First Time?</a></li>
                <li><a className="inline-block bg-[#020202] text-white px-16 py-3 rounded-full text-base font-semibold hover:bg-[#000858] transition">Give</a></li>
            </ul>
            
            
        </div>
        </>
    )
}