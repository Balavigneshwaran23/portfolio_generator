import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './components/Preloader';
import Header from './components/header';
import Hero from './components/hero';
import Gen_form from './form/GeneratorForm';
import PortfolioPreview from './components/PortfolioPreview';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-sans">
      {loading ? (
        <Preloader />
      ) : (
        <Router>
          <Header />
          <Routes>
          <Route path="/" element={<><Hero /><PortfolioPreview /></>} />
            <Route path="/generator" element={<Gen_form />} />
          </Routes>
          
        </Router>
      )}
    </div>
  );
};

export default App;
