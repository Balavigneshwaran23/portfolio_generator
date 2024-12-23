import React, { useState } from 'react';

const ProjectForm = ({ projects, onProjectsChange }) => {
  const [project, setProject] = useState({ title: '', description: '' });

  const addProject = () => {
    onProjectsChange([...projects, project]);
    setProject({ title: '', description: '' });
  };

  const removeProject = (index) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Projects</h2>
      <div className="space-y-2">
        {projects.map((proj, index) => (
          <div key={index} className="p-2 border rounded flex justify-between">
            <div>
              <h3 className="font-semibold">{proj.title}</h3>
              <p>{proj.description}</p>
            </div>
            <button onClick={() => removeProject(index)} className="text-red-600">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Project Title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Project Description"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          className="w-full p-2 border rounded"
        ></textarea>
        <button onClick={addProject} className="w-full bg-blue-500 text-white py-2 rounded">
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
