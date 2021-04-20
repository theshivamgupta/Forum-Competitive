import {
  Button,
  Card,
  Hidden,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import logo from "../images/logo.png";
import blog from "../images/blog.jpg";
import { useLoginPageStyles } from "../styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import ErrorAlert from "../components/shared/ErrorAlert";
import Alert from "@material-ui/lab/Alert";
function ForgotPassword({ handleForgetPass }) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const classes = useLoginPageStyles();
  const { updatePassword } = React.useContext(AuthContext);

  function handleValue(e) {
    setValue(e.target.value);
  }

  async function handleForgotPass(e) {
    e.preventDefault();
    if (!isEmail(value)) {
      setError((prev) => !prev);
      return;
    }
    await updatePassword(value);
    setSuccess(true);
  }

  return (
    <>
      {error && (
        <ErrorAlert message={`Enter Valid Email`} setError={setError} />
      )}
      {success && (
        <SuccessAlert message={`Reset Email Sent`} setSuccess={setSuccess} />
      )}
      <div className="container">
        <div>
          <img src={logo} alt="logo" className="logo-container" />
          <Hidden xsDown={true}>
            <img src={blog} alt="Login Intro" className="image-container" />
          </Hidden>
        </div>
        <section className={classes.section}>
          <article>
            <Card className={classes.card}>
              {/* <CardHeader className={classes.cardHeader} /> */}
              <div style={{ display: "flex" }}>
                <ArrowBackIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleForgetPass}
                />
                <h1
                  style={{
                    fontSize: "23px",
                    marginLeft: "10px",
                    marginBottom: "30px",
                  }}
                >
                  Forgot Password?
                </h1>
              </div>
              <div style={{ margin: "10px" }}></div>
              <h2
                style={{
                  color: "grey",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                Don't Worry! Enter your e-mail address below. We will send you
                an email with instructions to reset your password.
              </h2>
              <TextField
                name="input"
                fullWidth
                variant="filled"
                label="Email"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                onChange={handleValue}
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
                onClick={handleForgotPass}
              >
                Sent Password
              </Button>
            </Card>
            <Card className={classes.signUpCard}>
              <Typography align="right" variant="body2">
                Don't have an account?
              </Typography>
              <Link to="/accounts/emailsignup">
                <Button color="primary" className={classes.signUpButton}>
                  Sign up
                </Button>
              </Link>
            </Card>
          </article>
        </section>
      </div>
    </>
  );
}

function SuccessAlert({ message, setSuccess }) {
  const [alert, setAlert] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
    setSuccess(false);
  };

  return (
    <Snackbar
      open={alert}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ForgotPassword;
