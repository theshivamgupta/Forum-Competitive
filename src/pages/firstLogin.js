import {
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import LoopSharpIcon from "@material-ui/icons/LoopSharp";
import React from "react";
import { useParams } from "react-router";
import SEO from "../components/shared/Seo";
import { useLoginPageStyles } from "../styles";
import "./firstLogin.css";

function FirstLogin() {
  const { username } = useParams();
  const classes = useLoginPageStyles();

  const [rotateImage, setRotateImage] = React.useState(false);
  const [value, setValue] = React.useState("");

  function handleRotate(e) {
    e.preventDefault();
    setRotateImage((prev) => !prev);
    console.log({ rotateImage });
  }

  function handleInput(e) {
    setValue(e.target.value);
  }

  const loadingIcon = (
    <LoopSharpIcon
      onClick={handleRotate}
      className={rotateImage ? ".rotated-image" : ""}
      style={{ cursor: "pointer" }}
    />
  );

  return (
    <>
      <SEO title={`${username}`} />
      <Typography>Enter your CodeForces Handle</Typography>
      <section className={classes.section}>
        <Card className={classes.card}>
          <TextField
            name="input"
            fullWidth
            variant="filled"
            label="CodeForces Handle"
            margin="dense"
            className={classes.textField}
            InputProps={{
              endAdornment: loadingIcon,
            }}
            onChange={handleInput}
          />
        </Card>
      </section>
    </>
  );
}

export default FirstLogin;
