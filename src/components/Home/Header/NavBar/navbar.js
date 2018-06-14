import React from 'react';
import { Link } from 'react-router-dom';

import './navbar.css';

const NavBar = () => (
  <nav id="navbar">
    <ul>
      <li><Link className="btn btn-primary" to="/signin" href="/signin">Sign in</Link></li>
      <li><Link className="btn btn-primary" to="/signup" href="/signup">Sign up</Link></li>
    </ul>
  </nav>
);

export default NavBar;
