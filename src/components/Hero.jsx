import firstImage from "../assets/Images/firstHero.jpg"
import secondImage from "../assets/Images/secondHero.jpg"
import thirdImage from "../assets/Images/third.jpg"
import fourthImage from "../assets/Images/fourthHero.jpg"
export default function Hero() {
    return (
        <>
        <div className="w-full h-80 bg-[#dfd8d2] lg:object-contain md:h-[100vh] px-10" >
            <div className="flex flex-wrap justify-between items-center mx-auto w-full max-w-full">
                <h3 className="tracking-tighter break-words text-black text-[clamp(4rem,10vw,8rem)] md:text-8xl md:pt-10 md:pl-10 lg:pl-15 font-bold " >REVIVE</h3>
                <img src={firstImage}alt="photo of Apostle Light" className="text-[clamp(1rem,5vw,3rem)] w-full max-w-20 h-auto max-h-11"/>
            </div> 
            
            <div className="flex flex-wrap  justify-between items-center pt-5 mx-auto">
                <img src={secondImage} alt="photo of Apostle" className="w-20 h-11 " />
                <h3 className="tracking-tighter  break-words text-[clamp(4rem,10vw,8rem)] text-black text-5xl md:text-8xl md:pt-10 md:pl-10 lg:pl-15 font-bold">GOSPEL</h3> 
            </div>
            
            <div className="flex flex-wrap  items-center justify-between">
                <h3 className="tracking-tighter  break-words text-black text-5xl md:text-8xl md:pt-10 md:pl-10 lg:pl-15 font-bold ">EMBASSY</h3>
                <div className="">
                    <img src={thirdImage} alt="church photo" className="w-20 h-11 "/>
                <img src={fourthImage} alt="church photo" className="w-20 h-11"/>
                </div>
            </div>
            
            <p className="pt-20 text-black ">...to infect men with the 
            undying fire and zeal for
             the kingdom of God
            </p>  
        </div> 
    
             
        
        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </>
    )

}