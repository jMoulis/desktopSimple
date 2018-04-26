import React from 'react';
import './unauthorized.css';
import Header from '../../containers/Home/Header/header';
import Footer from '../../containers/Home/Footer/footer';

const Unauthorized = () => (
  <div className="unauthorized">
    <Header />
    <div>
      <h1>Unauthorized</h1>
    </div>
    <Footer />
  </div>
);

export default Unauthorized;
