import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navigate_pages.css'; 

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/'); // Navigate to the root URL
  };

  const navigateToPage = (url: string) => {
    navigate(url); // Navigate to the specified URL
  };

  // Array of pages with name and URL
  const pages = [
      { name: 'Home', url: '/home' },
      { name: 'College Nine/John R. Lewis ', url: '/c9c10' },
      { name: 'Cowell/Stevenson', url: '/cowell_stevenson' },
      { name: 'Crown/Merrill', url: '/crown_merrill' },
      { name: 'Porter/Kresge', url: '/porter_kresge' },
      { name: 'Rachel Carson/Oakes', url: '/rcc_oakes' },
      { name: 'Global Village Cafe', url: '/global_village' },
      { name: 'Oakes Cafe', url: '/oakes_cafe' },
      { name: 'Owl\'s Nest Cafe', url: '/owls_nest' },
      { name: 'Stevenson Coffee House', url: '/coffee_house' },
  ];

  return (
    <nav className="navigation-bar">
      <ul className="navigation-list">
        {pages.map((page, index) => (
          <li key={index}>
            {page.name === 'Home' ? (
              <button onClick={navigateToHome}>{page.name}</button>
            ) : (
              <button onClick={() => navigateToPage(page.url)}>{page.name}</button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
