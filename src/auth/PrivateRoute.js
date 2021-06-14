import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authState } = React.useContext(AuthContext);
  const isAuth = authState.status === "in";
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/accounts/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
