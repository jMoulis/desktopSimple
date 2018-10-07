import React from 'react';
import './index.css';

const Drawing = () => (
  <div className="drawing">
    <div className="drawing-item">
      <span>Mettez en ligne votre projet/idée</span>
      <img src="/img/project-student.png" alt="idea" />
    </div>
    <div className="drawing-item">
      <span>Les étudiants s'organisent pour produire</span>
      <img src="/img/student.png" alt="Students" />
    </div>
    <div className="drawing-item">
      <span>A la fin du projet partagez ensemble le résultat</span>
      <img src="/img/prez.png" alt="Students" />
    </div>
  </div>
);

export default Drawing;
