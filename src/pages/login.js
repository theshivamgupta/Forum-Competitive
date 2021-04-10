import React from "react";
import { useLoginPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Snackbar,
  Hidden,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import FacebookIconBlue from "../images/icons8-google.svg";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/client";
import { GET_LAST_LOGIN, GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";
import logo from "../images/logo.png";
import blog from "../images/blog.jpg";
import Alert from "@material-ui/lab/Alert";
import "./login.css";
import ForgotPassword from "./ForgotPassword";

function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const { logInWithEmailAndPassword } = React.useContext(AuthContext);
  const [showPassword, setPasswordVisibility] = React.useState(false);
  const hasPassword = Boolean(watch("password"));
  const history = useHistory();
  const client = useApolloClient();
  // console.log({ client });
  const [error, setError] = React.useState("");
  const [verifyError, setVerifyError] = React.useState(false);
  const [forgetPass, setForgetPass] = React.useState(false);
  async function onSubmit({ input, password }) {
    try {
      setError("");
      if (!isEmail(input)) {
        input = await getUserEmail(input);
        // console.log({ input });
      }
      // console.log({ data });
      const data = await logInWithEmailAndPassword(input.userEmail, password);
      if (!data?.user?.emailVerified) {
        setVerifyError(true);
        return;
      }
      console.log({ data });
      setTimeout(() => history.push("/"), 0);
    } catch (error) {
      // console.error("Error logging in", error);
      handleError(error);
    }
  }

  function handleError(error) {
    if (error?.code?.includes("auth")) {
      setError(error.message);
    }
  }

  async function getUserEmail(input) {
    const variables = { input };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables,
    });
    const res = await client.query({
      query: GET_LAST_LOGIN,
      variables,
    });
    const userEmail = response.data.users[0]?.email || "no@email.com";
    const lastLogin = res?.data?.users[0]?.last_login || null;
    const userUsername = res?.data?.users[0]?.username || null;
    // const lastLogin = null;
    return { userEmail, lastLogin, userUsername };
  }

  function togglePasswordVisibility() {
    setPasswordVisibility((prev) => !prev);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setVerifyError(false);
  };

  function handleForgetPass(e) {
    e.preventDefault();
    setForgetPass((prev) => !prev);
  }

  return (
    <>
      <SEO title="Login" />
      <Snackbar
        open={verifyError}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          Please Verify Your Account!
        </Alert>
      </Snackbar>
      {!forgetPass && (
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
                <Hidden xsDown>
                  <img src={logo} alt="logo" style={{ width: "100%" }} />
                </Hidden>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    name="input"
                    inputRef={register({
                      required: true,
                      minLength: 5,
                    })}
                    fullWidth
                    variant="filled"
                    label="Username, email, or phone"
                    margin="dense"
                    className={classes.textField}
                    autoComplete="username"
                  />
                  <TextField
                    name="password"
                    inputRef={register({
                      required: true,
                      minLength: 5,
                    })}
                    InputProps={{
                      endAdornment: hasPassword && (
                        <InputAdornment>
                          <Button onClick={togglePasswordVisibility}>
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="filled"
                    label="Password"
                    margin="dense"
                    className={classes.textField}
                    autoComplete="current-password"
                  />
                  <Button
                    disabled={!formState.isValid || formState.isSubmitting}
                    variant="contained"
                    fullWidth
                    color="primary"
                    className={classes.button}
                    type="submit"
                  >
                    Log In
                  </Button>
                </form>
                <div className={classes.orContainer}>
                  <div className={classes.orLine} />
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      OR
                    </Typography>
                  </div>
                  <div className={classes.orLine} />
                </div>
                <LoginWithFacebook color="secondary" iconColor="blue" />
                <AuthError error={error} />
                <Button fullWidth color="secondary" onClick={handleForgetPass}>
                  <Typography variant="caption">Forgot password?</Typography>
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
      )}
      {forgetPass && <ForgotPassword handleForgetPass={handleForgetPass} />}
    </>
  );
}

export function LoginWithFacebook({ color, variant }) {
  const classes = useLoginPageStyles();
  const { logInWithGoogle } = React.useContext(AuthContext);
  const facebookIcon = FacebookIconBlue;
  const [error, setError] = React.useState("");
  const history = useHistory();

  async function handleLogInWithGoogle() {
    try {
      await logInWithGoogle();
      setTimeout(() => history.push("/"), 0);
    } catch (error) {
      console.error("Error logging in with Google", error);
      setError(error.message);
    }
  }

  return (
    <>
      <Button
        onClick={handleLogInWithGoogle}
        fullWidth
        color={color}
        variant={variant}
      >
        <img
          src={facebookIcon}
          alt="facebook icon"
          className={classes.facebookIcon}
        />
        Log In with Google
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
