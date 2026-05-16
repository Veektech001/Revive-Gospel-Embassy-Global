export default function TakeStep(props) {
    return (
        <>
        <article className="mt-24 md:flex justify-between">
           <div>
            <img className="w-full h-80 object-cover pl-5 pr-5 md:w-[500px]"
          src={props.img.src}
          alt={props.img.alt}
          />
          </div>
          <div>
            <h3 className= "h-[50px] text-black text-center w-fit mx-auto px-4 py-2 rounded border-2 mt-4">{props.heading}</h3>
          </div> 
        </article>
        
          
        
          
        </>
    )
}