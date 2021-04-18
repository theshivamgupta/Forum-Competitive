import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SEO from "../components/shared/Seo";
import { useHistory, useParams } from "react-router";
import { Hidden, Snackbar, TextField } from "@material-ui/core";
import { useMediaQuery } from "react-responsive";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { fetchUserhandle } from "../utils/api/CodeForces";
import firstlogin from "../images/firstlogin.svg";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useMutation } from "@apollo/client";
import { EDIT_CODEFORCES } from "../graphql/mutations";
import Alert from "@material-ui/lab/Alert";

function CodeForces({ setCodeforcesRating, setCodeForcesHandle }) {
  const [handle, setHandle] = React.useState("");
  const [error, setError] = React.useState(false);
  function handleHandleChange(e) {
    setHandle(e.target.value);
  }

  async function handleHandleClick() {
    const data = await fetchUserhandle(handle);
    if (!data) {
      setError(true);
      return;
    }
    setCodeforcesRating(data);
    setCodeForcesHandle(handle);
    // console.log(data);
  }

  const arrowIcon = (
    <ArrowForwardIcon className="cursor-pointer" onClick={handleHandleClick} />
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  return (
    <>
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          Enter Valid handle!
        </Alert>
      </Snackbar>
      <div className="mb-5">
        <TextField
          name="input"
          fullWidth
          color="primary"
          variant="filled"
          label="CodeForces Handle (Optional)"
          margin="dense"
          className="mt-0"
          InputProps={{
            endAdornment: arrowIcon,
          }}
          // defaultValue={handle}
          onChange={handleHandleChange}
        />
      </div>
    </>
  );
}

const tutorialSteps = [
  {
    label: "CodeForces Handle",
    imgPath: CodeForces,
  },
];

export default function TextMobileStepper() {
  const [codeforcesRating, setCodeforcesRating] = React.useState("");
  const [codeforcesHandle, setCodeForcesHandle] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);
  const { username } = useParams();
  const history = useHistory();
  const activeStep = 0;

  const [editCodeforces] = useMutation(EDIT_CODEFORCES);

  const isHidden = useMediaQuery({ query: "(max-width: 800px)" });
  const Component = tutorialSteps[activeStep].imgPath;

  async function handleHandleUpload(e) {
    e.preventDefault();
    setSpinner((prev) => !prev);
    const variables = {
      username,
      handle: codeforcesHandle,
      rating: parseInt(codeforcesRating),
      lastlogin: new Date().toISOString(),
    };
    await editCodeforces({ variables });
    setSpinner((prev) => !prev);
    history.push("/");
  }

  return (
    <div className="flex flex-row">
      <SEO title={`${username}`} />
      <Hidden xsDown>
        <img
          src={firstlogin}
          alt="container"
          className="h-full w-2/4 mt-6 mr-28"
          style={{ display: isHidden ? "none" : "inline-block" }}
        />
      </Hidden>
      <section
        className={`flex flex-col ${
          isHidden ? "justify-center items-center" : ""
        }`}
        style={{ height: "max-content", margin: "auto 0" }}
      >
        <Paper
          square
          elevation={2}
          className="max-w-full align-middle"
          style={{
            margin: isHidden ? "auto" : "",
            maxWidth: isHidden ? "50vw" : "100%",
          }}
        >
          <Typography className="w-96 p-2 px-3 text-center">
            {tutorialSteps[activeStep].label}
          </Typography>
          <Component
            setCodeforcesRating={setCodeforcesRating}
            setCodeForcesHandle={setCodeForcesHandle}
          />
          <Typography
            className="m-auto mb-5 text-center font-serif font-extrabold"
            variant="h6"
          >
            Your Rating is: {codeforcesRating}
          </Typography>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={!spinner ? <SaveIcon /> : ""}
          style={{ right: "0" }}
          onClick={handleHandleUpload}
        >
          {spinner ? (
            <CircularProgress color="inherit" size="1.5rem" thickness={6} />
          ) : (
            "Save"
          )}
        </Button>
      </section>
    </div>
  );
}
