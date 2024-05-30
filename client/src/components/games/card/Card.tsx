import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  imageSrc?: string;
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  IconComponent?: React.ElementType;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  title,
  description,
  linkTo,
  buttonText,
  IconComponent
}) => {
  return (
    <div className="choice">
      <div className="card">
          {imageSrc ?
          <div className="icon">
            <div className="circle"></div>
            <img src={imageSrc} alt={title} className="game-icon"/>
          </div>
          :
          <div className="icon">            
            <div className="circle"></div>
            {IconComponent && <IconComponent className="game-icon"/>}
          </div>
          }
        <div className="info">
          <Link className="title" to={linkTo}>
            {title}
          </Link>
          <h3>{description}</h3>
          <button className="mode">{buttonText}</button>
          <div className="play">
            <Link to={linkTo}>
            Play Now
            </Link>
          </div>
          <div className="play">
            <Link to={linkTo} state={{ isRanked: true }}>Ranked</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Card;
