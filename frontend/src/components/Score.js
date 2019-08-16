import React from "react";

const Score = props => {
  return (
    <h2>
      Correct answers: <span className="corrects">{props.score}</span>
    </h2>
  );
};

export default Score;
