export default function PapaAndMama() {
    return(
        <>
        <div className="relative h-[500px]">

            <div>
                <img className="w-full h-56 object-cover pl-5 pr-5"
                src="https://plus.unsplash.com/premium_photo-1723701832228-ab221dbd3fd4?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
            </div>
        
          
            <div  className="h-14 absolute top-48 left-16  inline-block bg-red-500">
                <p className="pt-4">OUR SENIOR PASTORS</p>
            </div>

            <div className="h-7 absolute top-56 right-16  inline-block bg-red-500">
                <p>Light + Nchedo</p>
            </div>
         <div className="mt-10 ml-5">
            <p>Together they are committed to building the church, helping people:</p>
            <ul className="list-disc pl-5 space-y-2 ml-10">
                <li>Encounter God</li>
                <li>Live Worthy of Purpose</li>
                <li>Become More Like Jesus</li>
                <li>Be disciples who make disciples</li>
            </ul>
        </div>   
        </div>
        
        
        
          
        </>
    )
}