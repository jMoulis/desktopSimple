import React from 'react';
import NavBar from '../../../containers/Home/Header/NavBar/navbar';
import './header.css';

const Header = () => (
  <header className="home-header">
    <div>
      <h1>E²</h1>
      <p>Etudiants et Entreprises - l'équation parfaite</p>
    </div>
    <NavBar />
  </header>
);

export default Header;
