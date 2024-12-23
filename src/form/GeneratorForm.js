import React, { useState } from "react";
import ProjectForm from "./ProjectForm";

export default function Gen_Form() {
  const [projects, setProjects] = useState([]);
  const [portfolio, setPortfolio] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    website: "",
    linkedin: "",
    whatsapp: "",
    gmail: "",
    profilePicture: "",
  });

  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Portfolio Details:", portfolio);
    console.log("Projects:", projects);
    alert("Portfolio successfully created!");
  };

  return (
    <div className="bg-black  min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl text-white w-full bg-gray-800 p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-6">Create your Portfolio</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
          <label className="block text-sm font-medium text-gray-400">
    Profile Picture
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPortfolio((prev) => ({
            ...prev,
            profilePicture: event.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    }}
    className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
  />
  {portfolio.profilePicture && (
    <img
      src={portfolio.profilePicture}
      alt="Profile"
      className="w-32 h-32 rounded-full mt-4 mx-auto"
    />
  )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={portfolio.name}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={portfolio.email}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Bio</label>
            <textarea
              name="bio"
              placeholder="Write a short bio about yourself"
              value={portfolio.bio}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="E.g., JavaScript, React, Python"
              value={portfolio.skills}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Website/Portfolio Link
            </label>
            <input
              type="text"
              name="website"
              placeholder="Enter your website or portfolio URL"
              value={portfolio.website}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin"
              placeholder="Enter your LinkedIn profile URL"
              value={portfolio.linkedin}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              placeholder="Enter your WhatsApp number or URL"
              value={portfolio.whatsapp}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Gmail</label>
            <input
              type="text"
              name="gmail"
              placeholder="Enter your Gmail ID"
              value={portfolio.gmail}
              onChange={handlePortfolioChange}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="text-black">  <ProjectForm projects={projects} onProjectsChange={setProjects} /></div>
        

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md w-full"
          >
            Generate Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}
