import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './navigate_pages.css'; 

type CloseMenuFunction = () => void;
interface SideMenuProps {
  onClose: CloseMenuFunction;
}
const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const navigateToProfile = () => {
    onClose(); // Close the side menu when navigating
    navigate('/profile'); // Navigate to the Profile page
  };

  const navigateToSettings = () => {
    onClose(); // Close the side menu when navigating
    navigate('/settings'); // Navigate to the Settings page
  };

  return (
    <div className="side-menu">
      <button className="menu-button" onClick={onClose}>X</button>
      <div className="menu-items">
        <button className="menu-item" onClick={navigateToProfile}>Profile</button>
        <button className="menu-item" onClick={navigateToSettings}>Settings</button>
      </div>
    </div>
  );
};

// Define a new component for the Profile page
const Profile = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Profile Page containing the user's posts or something</h1>
      {/* Add any additional content for the Profile page here */}
    </div>
  );
};

// Define a new component for the Settings page
const Settings = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Settings Page containing the user's information idk</h1>
      {/* Add any additional content for the Settings page here */}
    </div>
  );
};

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/'); // Navigate to the root URL
  };

  const navigateToPage = (url: string) => {
    navigate(url); 
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
  
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <nav className="navigation-bar">
      <div className="side-menu-toggle">
        <button className="menu-button" onClick={toggleSideMenu}>☰</button> {}
      </div>
      {isSideMenuOpen && <SideMenu onClose={toggleSideMenu} />} {}
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
      {isSideMenuOpen && <SideMenu onClose={toggleSideMenu} />}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <NavigationBar/>
      <Routes>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
    </div>
  );
};

export default App;
