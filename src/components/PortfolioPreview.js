import React from "react";
import { Link } from "react-router-dom";  // Import Link for navigation

import por_gen1 from "../assets/images/portfolio_gen_bg1.jpg";
import por_gen2 from "../assets/images/portfolio_gen_bg2.jpg";
import por_gen3 from "../assets/images/portfolio_gen_bg3.jpg";
import por_gen4 from "../assets/images/portfolio_gen_bg4.jpg";

const companies = [
  {
    logo: "dormakaba",
    image: por_gen1,
    description: "Because reliable support matters",
    subtext: "Reduced cost to deliver marketing pages",
  },
  {
    logo: "Dropbox Sign",
    image: por_gen2,
    description: "Get contracts signed 80% faster",
    subtext: "Faster speed to market",
  },
  {
    logo: "Fivetran",
    image: por_gen3,
    description: "Moving data. Powering innovation.",
    subtext: "New web pages launched in 1 year",
  },
];

export default function PortfolioPreview() {
  return <>
    
    <div id="template" className=" bg-black text-white min-h-screen flex items-center justify-center">
    <h2 className=" relative -top-60 text-center text-4xl font-bold mb-10  font-sportyfont text-blue-500">Templates<span className="text-white">/-</span> </h2>
      <div className="grid grid-cols-1 relative -left-36  sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full max-w-7xl">
        {companies.map((company, index) => (
          <Link
            key={index}
            to="/generator" 
            className="bg-gray-800 rounded-lg shadow-lg p-6 mt-10 flex flex-col items-start hover:border-blue-500 border-2 transition-all duration-300 hover:shadow-[0_0_5px_2px_rgba(59,130,246,1),0_0_30px_10px_blue]"
          >
            {/* Logo Section */}
            <div className="text-2xl font-bold mb-4">{company.logo}</div>

            {/* Image Section */}
            <div className="mb-6 w-full">
              <img
                src={company.image}
                alt={company.logo}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-lg font-medium">{company.description}</p>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-3xl font-bold mb-1">{company.stat}</h3>
              <p className="text-sm text-gray-400">{company.subtext}</p>
            </div>
          </Link>
        ))}
      </div>
    </div></>

}
