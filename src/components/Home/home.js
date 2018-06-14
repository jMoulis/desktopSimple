import React from 'react';
import PropTypes from 'prop-types';
import './home.css';
import Header from '../../containers/Home/Header/header';
import Footer from '../../containers/Home/Footer/footer';

const Home = ({ children }) => (
  <div id="homepage">
    <Header />
    {children}
    <Footer />
  </div>
);

Home.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Home;
