export default function Sermon(props){
    return (
        <>
        <article className="mt-24 md:flex justify-between">
            <div >
                <img className="w-full h-48 object-cover pl-5 pr-5 md:w-[500px] "
                    src={props.img.src}
                    alt={props.img.alt}
            />
            </div>
            <div>
                <p className="text-red-950 ">{props.date}</p>
                <p className="text-red-950 text-4xl text-center font-bold">{props.topic} // Apostle Light Iwuh</p>
            </div>
            
            

        </article>
        </>
    )
}