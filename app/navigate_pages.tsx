import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navigate_pages.css'; 

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const navigateToPage = () => {
    navigate('/'); // Navigate to the root URL
  };

  // Array of pages with name and URL
  const pages = [
      { name: 'Home', url: '/home' },
      { name: 'C9/C10', url: '/c9c10' },
      { name: 'Cowell/Stevenson', url: '/cowell_stevenson' },
      { name: 'RCC/Oakes', url: '/rcc_oakes' },
      { name: 'Crown/Merill', url: '/crown_merill' },
      { name: 'Porter/Kresge', url: '/porter_kresge' },
      { name: 'Global Village Cafe', url: '/global_village' },
      { name: 'Oakes Cafe', url: '/oakes_cafe' },
      { name: 'Stevenson Coffee House', url: '/coffee_house' },
  ];

  return (
    <nav className="navigation-bar">
      <ul className="navigation-list">
        {pages.map((page, index) => (
          <li key={index}>
            {/* Use navigateToPage function onClick for the "Home" button */}
            {page.name === 'Home' ? (
              <button onClick={() => navigateToPage()}>{page.name}</button>
            ) : (
              <a href={page.url}>{page.name}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
