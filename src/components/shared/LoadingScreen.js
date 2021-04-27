import React from "react";
import { useLoadingScreenStyles } from "../../styles";
import "../../assets/LoadingScreen.css";

function LoadingScreen() {
  const classes = useLoadingScreenStyles();

  return (
    <section className={classes.section}>
      <div className="wrapper">
        <div className="box-wrap">
          <div className="box one"></div>
          <div className="box two"></div>
          <div className="box three"></div>
          <div className="box four"></div>
          <div className="box five"></div>
          <div className="box six"></div>
        </div>
      </div>
    </section>
  );
}

export default LoadingScreen;
