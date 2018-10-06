import React from 'react';
// import PropTypes from 'prop-types';
import Button from '../../Form/button';
import './content.css';
import Row from '../Layout/Row/Row';
import Tile from '../Layout/Tile/Tile';

const testimonies = [
  {
    user: {
      name: 'Armand Latour',
      picture: 'https://randomuser.me/api/portraits/women/71.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Armand Latour',
      picture: 'https://randomuser.me/api/portraits/women/73.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Armand Latour',
      picture: 'https://randomuser.me/api/portraits/men/71.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
  {
    user: {
      name: 'Armand Latour',
      picture: 'https://randomuser.me/api/portraits/men/73.jpg',
    },
    message: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
    accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis`,
  },
];

const partenaires = [
  {
    picture: '/img/company-generic.png',
    name: 'fake company',
  },
  {
    picture: '/img/company-generic.png',
    name: 'fake company',
  },
  {
    picture: '/img/company-generic.png',
    name: 'fake company',
  },
  {
    picture: '/img/company-generic.png',
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
      }}
    >
      <img
        style={{
          height: '400px',
        }}
        src="/img/company_idea.png"
        alt="Man has many ideas"
      />
      <article>
        <h1 className="huge-title flex1">
          N'ayez plus peur de rêver, ne bridez plus votre imagination!
        </h1>
        <p className="explication">
          Toutes les idées méritent une attention particulière. Malheureusement,
          jusqu'à aujourd'hui, vous deviez vous astreindre à une réalité...
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
        <form>
          <input placeholder="adresse mail" />
          <Button label="Commencez par ici" type="submit" />
        </form>
      </article>
    </Row>
    <Row
      styleProps={{
        justifyContent: 'center',
      }}
    >
      <h2 className="subtitle">
        Une plateforme conçue pour donner vie à toutes vos idées
      </h2>
      <p className="explication">
        La plateforme E² vous permet de mettre en ligne,&nbsp;
        <em>en toute sécurité</em>, vos idées / projets. Les étudiants pourront
        ainsi s'organiser en équipe afin de travailler sur votre projet tout en
        validant leurs études. Ainsi, vous offrez non seulement,&nbsp;
        <em>une chance à vos idées</em>, mais également une&nbsp;
        <em>opportunité inégalée</em> aux étudiants de travailler sur des
        projets concrets.
      </p>
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
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2 className="subtitle">Une plateforme unique</h2>
      <p
        className="explication text-center"
        style={{
          width: '50%',
        }}
      >
        Afin de faciliter l'utilisation de la plateforme E². Nous nous sommes
        basés sur l'environnement que vous utilisez tous les jours.
      </p>
      <video
        style={{
          width: '40%',
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
      <ul className="d-flex">
        {testimonies.map((testimony, index) => (
          <li
            key={index}
            style={{
              padding: '1rem',
            }}
            className="d-flex flex-column"
          >
            <header
              style={{
                padding: '.5rem 0',
              }}
              className="d-flex flex-align-items-center"
            >
              <img
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                }}
                src={testimony.user.picture}
                alt="Temoignage"
              />
              <span>{testimony.user.name}</span>
            </header>
            <p>{testimony.message}</p>
          </li>
        ))}
      </ul>
    </Row>
    <Row
      styleProps={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 className="subtitle">Partenaires</h2>
      <ul className="d-flex flex-justify-around full-width">
        {partenaires.map((partenaire, index) => (
          <li
            key={index}
            className="d-flex flex-column flex-align-items-center"
          >
            <img
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '10%',
              }}
              src={partenaire.picture}
              alt="Company"
            />
          </li>
        ))}
      </ul>
    </Row>
  </div>
);

Content.propTypes = {};

export default Content;
