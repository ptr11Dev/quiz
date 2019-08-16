import React from "react";

const Button = props => {
  return (
    <button
      className={props.name}
      onClick={props.onclick}
      data-answer={props.set}
      disabled={props.dis}
    >
      {props.content}
    </button>
  );
};

export default Button;
