import React from 'react';
import Content from '../../containers/Home/Content/content';
import './home.css';
import Header from '../../containers/Home/Header/header';
import Footer from '../../containers/Home/Footer/footer';

const Home = props => (
  <div id="homepage">
    <Header />
    {props.children}
    <Footer />
  </div>
);

export default Home;
