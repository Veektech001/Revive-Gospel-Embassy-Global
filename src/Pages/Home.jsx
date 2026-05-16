import Prayer from "../components/prayers"
import Nav from "../components/Navbar"
import Hero from "../components/Hero"
import Footer from "../components/footer"
import TakeStep from "../components/TakeStep"
import TakeAStep from "../assets/Data/TakeAStep"
import MissionAndVision from "../components/Mission-and-Vision"
import Afterhero from "../components/AfterHero"
import Welcome from "../components/welcome"
import Subscribe from "../components/subscribe"

export default function Homepage (){


    const eachStep = TakeAStep.map((step)=>{
        return (
            <TakeStep
            img={step.img}
            heading={step.heading}
            
            />
        )

    })
    return (
        <>
    <Nav /> 
    <Hero />
    <Afterhero />
    <Prayer />
    <Welcome />
    <MissionAndVision />
    {eachStep} 
    <Subscribe />
            
    
    
    <Footer />
        </>
    )
}