import React from 'react';

const PreviewHeader = ({ name, socialLinks }) => {
  return (
    <header className="bg-blue-500 text-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{name || 'Your Name'}</h1>
        <nav>
          <ul className="flex space-x-4">
            {socialLinks.linkedin && (
              <li>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {socialLinks.github && (
              <li>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub
                </a>
              </li>
            )}
            {socialLinks.twitter && (
              <li>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Twitter
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default PreviewHeader;
