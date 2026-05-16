export default function Form() {
    return(
        <>
        <form className=" max-w-md mx-auto p-10 rounded-lg shadow-md ">
            <div className="p-5">
                <label  for="name" className="block mb-2 font-semibold">Name:</label>
                <input 
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name" 
                className="w-full border border-gray-300 rounded px-4 py-2"
                />
            </div>
            
            <div className="p-5">
                <label htmlFor="phone">Phone Number:</label>
                <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded px-4 py-2"
                />
            </div>

            <div className="p-5">
                <label htmlFor="email">Email:</label>
                <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-4 py-2"
                /> 
            </div>
            
            <div className="p-5">
                <label htmlFor="address">Address:</label>
                <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
               className="w-full border border-gray-300 rounded px-4 py-2"
               />
            </div>

            <div className="p-5">
                <label  for="visit" className="block mb-2 font-semibold">When are you planning to Visit?</label>
                <input 
                type="text"
                id="visIt"
                name="visit"
                placeholder="DD/MM/YYYY" 
                className="w-full border border-gray-300 rounded px-4 py-2"
                />
            </div>
            <div className="p-5">
                <label for="question">Do you have any questions for us?</label>
                <textarea
                   type="text"
                   id="question"
                   name="question"
                   className="w-full border border-gray-300 rounded px-4 py-2 h-32 outline-none focus:border-black"

                                         
                ></textarea>
            </div>
            <div className="flex justify-center">
                <button 
                type="submit"
                className=" mt-10 mx-auto
    bg-black
    text-white
    px-6
    py-3
    rounded-lg
    hover:bg-gray-800
    transition
    duration-300
    cursor-pointer
  " 
            
            >
                Submit
            </button>    
            </div>

            <h3 className="text-center font-bold ">Thank you!</h3>      
            <p className="text-center">We will connect with you soon!</p> 
        </form>
        </>
    )
} 