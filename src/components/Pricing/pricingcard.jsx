

export default function PricingCard(){

    return (
        <>
            <div className="border-2 border-indigo-600 text-black rounded-lg w-[350px] py-8 px-8 flex flex-col gap-2"> 
                <div className="flex flex-col gap-4 ">
                    <div className="flex flex-col gap-3 text-wrap">
                        <h3 className="text-xl font-bold">Professional</h3>
                        <p className="">Ideal for individuals who who need advanced features and tools for client work.</p>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-2 items-center">
                            <h3 className="text-4xl ">$25</h3>
                            <p className="text-gray-500">/Month</p>
                        </div>
                        <a href="">
                            <div className="text-center text-white py-4 bg-indigo-600 border rounded-xl">
                                <p>Get Started Now</p>
                            </div>
                        </a>
                    </div>
                    <div >
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                     <div className="flex gap-1 items-center">
                        <div className="text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-sm">20,000+ of PNG & SVG graphics</p>
                     </div>
                     <div className="flex gap-1 items-center">
                        <div className="text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-sm">20,000+ of PNG & SVG graphics</p>
                     </div>
                     <div className="flex gap-1 items-center">
                        <div className="text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-sm">20,000+ of PNG & SVG graphics</p>
                     </div>
                     <div className="flex gap-1 items-center">
                        <div className="text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-sm">20,000+ of PNG & SVG graphics</p>
                     </div>
                </div>
                <div>
                </div>
            </div>
        </>
    )
}