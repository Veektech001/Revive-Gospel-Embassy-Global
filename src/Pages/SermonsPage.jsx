import sermonsdata from "../assets/Data/sermonsdata";
import Sermon from "../components/sermon";

export default function SermonPage() {
    const sermonElement = sermonsdata.map((preaching)=>{
        return (
            <Sermon 
            img={preaching.img}
            date={preaching.date}
            topic={preaching.topic} 

            />
        )
    })
    return (
        <>
        
        {sermonElement}
        </>
    )
}