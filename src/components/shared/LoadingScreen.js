import React from "react";
import { useLoadingScreenStyles } from "../../styles";

function LoadingScreen() {
  const classes = useLoadingScreenStyles();

  return (
    <section className={classes.section}>
      <span style={{ fontSize: "70px", color: "grey" }}>Loading...</span>
    </section>
  );
}

export default LoadingScreen;
