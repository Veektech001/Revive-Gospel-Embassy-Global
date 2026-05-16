export default function Give()  {
function click() {
   alert("You clicked me!");
}
    return(
    <button onClick={click}> click me</button>
        
        /*<>
           <div className="h-[100vh]">
            <h3 className="text-center text-3xl font-bold">ONLINE GIVING</h3>
           <p  className= "h-[50px] bg-white text-black text-center w-fit mx-auto px-4 py-2 rounded border-2 mt-4">CHURCH BUILDING</p>
           <p  className= "h-[50px] bg-white text-black text-center w-fit mx-auto px-4 py-2 rounded border-2 mt-4">OFFERING</p>
           <p  className= "h-[50px] bg-white text-black text-center w-fit mx-auto px-4 py-2 rounded border-2 mt-4">TITHE</p>
           
           </div>
           
        </>*/
    )

}