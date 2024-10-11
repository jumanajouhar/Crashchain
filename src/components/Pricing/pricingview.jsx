import PricingCard from "./pricingcard"
export default function Pricing() {
    return (
      <>
      <div id="Prices" className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
            <defs>
              <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
              <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
            </svg>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
          </svg>
        </div>
        <div className="w-full py-2 flex flex-col gap-4">
          <div className="flex flex-col gap-4 items-center"> {/* Ensure items are centered */}
            <div className="text-4xl text-center font-bold mb-4"> {/* Added margin-bottom */}
              <h3>Powerful features for powerful creators</h3>
              <h3 className="text-2xl py-3 text-indigo-600">Choose a plan that’s right for you</h3>
            </div>
            <div className="flex justify-center gap-8t ext-lg font-thin"> {/* Center and space between items */}
                <div className="text-center mr-4">
                    <p >Pay Monthly</p>
                </div>
                <input type="checkbox" value="synthwave" className="toggle theme-controller"/>
                <div className="indicator relative">
                    <span className="indicator-item badge bg-indigo-600 border-none absolute left-[60px] top-[0px] text-white ">-70%</span> 
                    <div className="text-center ml-4">
                        <p>Pay Yearly</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex py-5 flex-wrap gap-7 justify-center">
            <PricingCard />
            <PricingCard />
            <PricingCard />
          </div>
        </div>
      </>
    );
  }
  
  