import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";

function ErrorAlert({ message, setError }) {
  const [alert, setAlert] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
    setError(false);
  };

  return (
    <Snackbar
      open={alert}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="error" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
