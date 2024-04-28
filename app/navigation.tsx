"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Import the Link component from 'next/link'
import './navigation.css'; 

type CloseMenuFunction = () => void;
interface SideMenuProps {
  onClose: CloseMenuFunction;
}
const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {

  const closeSideMenu = () => {
    onClose(); // Close the side menu when navigating
  };

  return (
    <div className="side-menu">
      <button className="menu-button" onClick={onClose}>X</button>
      <div className="side-menu-items">
        <Link href="/profile"><button onClick={closeSideMenu}>Profile</button></Link>
        <Link href="/settings"><button onClick={closeSideMenu}>Settings</button></Link>
        <Link href="/login"><button onClick={closeSideMenu}>Log Out</button></Link>
      </div>
    </div>
  );
};

const NavigationBar: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Function to close the side menu
  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  return (
    <nav className="navigation-bar">
      <div className="side-menu-toggle">
        <button className="menu-button" onClick={toggleSideMenu}>☰</button> {}
      </div>
      {isSideMenuOpen && <SideMenu onClose={toggleSideMenu} />} {}
      <ul className="navigation-list">
        <Link href="/"><button onClick={closeSideMenu}>Home</button></Link>
        <Link href="/c9c10"><button onClick={closeSideMenu}>College Nine/John R. Lewis</button></Link>
        <Link href="/cowell_stevenson"><button onClick={closeSideMenu}>Cowell/Stevenson</button></Link>
        <Link href="/crown_merrill"><button onClick={closeSideMenu}>Crown/Merrill</button></Link>
        <Link href="/porter_kresge"><button onClick={closeSideMenu}>Porter/Kresge</button></Link>
        <Link href="/rcc_oakes"><button onClick={closeSideMenu}>Rachel Carson/Oakes</button></Link>
        <Link href="/global_village"><button onClick={closeSideMenu}>Global Village Cafe</button></Link>
        <Link href="/oakes_cafe"><button onClick={closeSideMenu}>Oakes Cafe</button></Link>
        <Link href="/owls_nest"><button onClick={closeSideMenu}>Owl's Nest Cafe</button></Link>
        <Link href="/coffee_house"><button onClick={closeSideMenu}>Stevenson Coffee House</button></Link>
      </ul>
      {isSideMenuOpen && <SideMenu onClose={toggleSideMenu} />}
    </nav>
  );
};

export default NavigationBar;
