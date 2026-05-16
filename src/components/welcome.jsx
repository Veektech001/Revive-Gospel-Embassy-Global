import image from "../assets/Images/BI.jpg"

export default function Welcome() {
    return (
        <>
         <div className="bg-black h-[500px] p-2">
            <div>
                <img className="w-full max-w-72 mx-auto pt-3"
             src={image}
                />
            </div>

           <div className="pt-16">
            <h3 className="text-white text-xl font-bold text-center">WELCOME TO RGE. OUR SUNDAY SERVICE IS AT 8:00AM. </h3>
          <h3 className="text-white text-base font-bold text-center pt-10">OUR FRIDAY SERVICE IS AT 4:30PM.</h3>
          <h4 className="text-white text-xl font-bold text-center">LOCATED AT SUG COMPLEX BEHIND ESUT SENIOR STAFF CLUB.</h4>
            
            </div>  
          </div>
        </>
    )
}