import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  title,
  description,
  linkTo,
  buttonText,
}) => {
  return (
    <div className="choice">
      <div className="card">
        <div className="icon">
          <div className="circle"></div>
          <img src={imageSrc} alt={title} />
        </div>
        <div className="info">
          <Link className="title" to={linkTo}>
            {title}
          </Link>
          <h3>{description}</h3>
          <button className="mode">{buttonText}</button>
          <div className="play">
            <Link className="title" to={linkTo}>
            Play Now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
