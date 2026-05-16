export default function Subscribe() {
    return(
        <>
        <form className=" max-w-md mx-auto p-10 rounded-lg shadow-md ">
            <h3 className="font-bold text-3xl">Sign up for our Newsletter</h3>
            <p>Subscribe to receive email updates with the latest news.</p>
            
            <div className="mt-10">
                <label for="email" >Email:</label>
                <input className="w-full border border-gray-300 rounded px-4 py-2 h-10 outline-none focus:border-black"
                id="email"
                type="text"
                name="email"
                placeholder="Enter Email"
            
                />
            </div>
            
            <button className=" mt-5 mx-auto
    bg-black
    text-white
    px-6
    py-3
    rounded-lg
    hover:bg-gray-800
    transition
    duration-300
    cursor-pointer
  ">Subscribe</button>
        </form>
        </>
    )
}