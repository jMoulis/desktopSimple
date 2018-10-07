import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './content.css';
import Row from '../Layout/Row/Row';
import Tile from '../Layout/Tile/Tile';
import Drawing from '../Layout/Drawing';
import Slider from '../Layout/Slider';
import TestimonySlide from '../Layout/Slider/TestimonySlide';
import PartenaireSlide from '../Layout/Slider/PartenaireSlide';

const testimonies = [
  {
    user: {
      name: 'Julien',
      picture: 'https://randomuser.me/api/portraits/women/71.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Rachel',
      picture: 'https://randomuser.me/api/portraits/women/73.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Simon',
      picture: 'https://randomuser.me/api/portraits/men/71.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Armand',
      picture: 'https://randomuser.me/api/portraits/men/73.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
];

const partenaires = [
  {
    picture: '/img/logo1.png',
    name: 'fake company',
  },
  {
    picture: '/img/logo2.png',
    name: 'fake company',
  },
  {
    picture: '/img/logo3.png',
    name: 'fake company',
  },
  {
    picture: '/img/logo4.png',
    name: 'fake company',
  },
];
const Content = () => (
  <div id="content">
    <Row
      styleProps={{
        justifyContent: 'center',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: '5rem',
        backgroundColor: 'rgb(151, 192, 183)',
      }}
      className="row first-row"
    >
      <img
        style={{
          height: '600px',
        }}
        className="content-header-img"
        src="/img/company_idea.png"
        alt="Man has many ideas"
      />
      <article className="header">
        <h1 className="huge-title flex1">
          N'ayez plus peur de rêver, ne bridez plus votre imagination!
        </h1>
        <div>
          <p className="explication">
            Toutes les idées méritent une attention particulière.
            Malheureusement, jusqu'à aujourd'hui, vous deviez vous astreindre à
            une réalité...
          </p>
          <p className="explication">
            <q>
              "Je n'ai ni le temps, ni les ressources humaines ou financières"
            </q>
          </p>
          <p className="explication">
            Mais grâce aux étudiants de tout l'hexagone ainsi qu'à E², une
            nouvelle réalité s'offre à vous!
          </p>
        </div>
        <Link
          className="btn btn-primary a-reset"
          style={{
            padding: '1rem',
          }}
          to="/signup"
          href="/signup"
        >
          Commencer par ici
        </Link>
      </article>
    </Row>
    <Row
      styleProps={{
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <h2 className="subtitle">
        Une plateforme conçue pour donner vie à toutes vos idées
      </h2>
      <Drawing />
    </Row>
    <Row
      styleProps={{
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2 className="subtitle">Des outils dédiés</h2>
      <div className="d-flex full-width flex-justify-around flex-wrap">
        <Tile title="Communiquer" icon="far fa-comments">
          La plateforme E² est centrée sur la communication et l'échange. Dès
          que vous êtes connecté le monde E² s'ouvre à vous.
        </Tile>
        <Tile title="Suivi de projet" icon="fas fa-tasks">
          Suivez les avancements des étudiants en direct
        </Tile>
        <Tile title="Répertoire" icon="far fa-address-book">
          En un click, accédez aux milliers d'étudiants et entreprises présents
          sur la plateforme E².
        </Tile>
      </div>
    </Row>
    <Row
      styleProps={{
        alignItems: 'flex-start',
        justifyContent: 'space-around',
      }}
      className="row plateforme-unique"
    >
      <div className="plateforme-unique-content">
        <h2 style={{ padding: 0 }} className="subtitle">
          Une plateforme unique
        </h2>
        <p
          className="explication text-center"
          style={{
            width: '100%',
            textAlign: 'left',
          }}
        >
          Afin de faciliter l'utilisation de la plateforme E². Nous nous sommes
          basés sur l'environnement que vous utilisez tous les jours.
        </p>
      </div>
      <video
        style={{
          width: '50%',
        }}
        controls
        src="/img/Student_Company.webm"
      >
        <track kind="captions" />
      </video>
    </Row>
    <Row
      styleProps={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 className="subtitle">Temoignages</h2>
      <Slider data={testimonies}>
        <TestimonySlide />
      </Slider>
    </Row>
    <Row
      styleProps={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 className="subtitle">Partenaires</h2>
      <Slider data={partenaires}>
        <PartenaireSlide />
      </Slider>
    </Row>
  </div>
);

Content.propTypes = {};

export default Content;
