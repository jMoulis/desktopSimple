import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../containers/Home/Header/NavBar/navbar';
import './header.css';

const Header = () => (
  <header className="home-header">
    <div className="home-header-logo">
      <Link className="a-reset" to="/" href="/">
        <h1
          style={{
            fontSize: '3rem',
          }}
        >
          E²
        </h1>
        <p>Etudiants et Entreprises - l'équation parfaite</p>
      </Link>
    </div>
    <NavBar />
  </header>
);

export default Header;
