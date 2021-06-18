import React from "react";
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import LoadingScreen from "./components/shared/LoadingScreen";
import PostModal from "./components/post/PostModal";
import { AuthContext } from "./auth";
import { useSubscription } from "@apollo/client";
import { ME } from "./graphql/subscriptions";
import PrivateRoute from "./auth/PrivateRoute";
import Loadable from "react-loadable";
import LoginPage from "./pages/login";

export const UserContext = React.createContext();

// const AsyncLoginPage = Loadable({
//   loader: () => import("./pages/login"),
//   loading: LoadingScreen,
// });

const AsyncSignupPage = Loadable({
  loader: () => import("./pages/signup"),
  loading: LoadingScreen,
});

const AsyncNotFoundPage = Loadable({
  loader: () => import("./pages/not-found"),
  loading: LoadingScreen,
});

const AsyncFirstLogin = Loadable({
  loader: () => import("./pages/firstLogin"),
  loading: LoadingScreen,
});

const AsyncTest = Loadable({
  loader: () => import("./Test"),
  loading: LoadingScreen,
});

const AsyncUpdatePost = Loadable({
  loader: () => import("./pages/UpdatePost"),
  loading: LoadingScreen,
});

const AsyncFeedPage = Loadable({
  loader: () => import("./pages/feed"),
  loading: LoadingScreen,
});

const AsyncExplorePage = Loadable({
  loader: () => import("./pages/explore"),
  loading: LoadingScreen,
});

const AsyncProfilePage = Loadable({
  loader: () => import("./pages/profile"),
  loading: LoadingScreen,
});

const AsyncPostPage = Loadable({
  loader: () => import("./pages/post"),
  loading: LoadingScreen,
});

const AsyncEditProfilePage = Loadable({
  loader: () => import("./pages/edit-profile"),
  loading: LoadingScreen,
});

function App() {
  const { authState } = React.useContext(AuthContext);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };
  const { data, loading } = useSubscription(ME, { variables });
  const history = useHistory();
  const location = useLocation();
  const prevLocation = React.useRef(location);
  const modal = location.state?.modal;

  React.useEffect(() => {
    if (history.action !== "POP" && !modal) {
      prevLocation.current = location;
    }
  }, [location, modal, history.action]);

  if (loading) return <LoadingScreen />;

  if (!isAuth) {
    return (
      <Switch>
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={AsyncSignupPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }

  const isModalOpen = modal && prevLocation.current !== location;
  const me = isAuth && data ? data.users[0] : null;
  const currentUserId = me.id;
  const followingIds = me.followings.map(({ user }) => user.id);
  const followerIds = me.followers.map(({ user }) => user.id);
  const feedIds = [...followingIds, currentUserId];

  return (
    <UserContext.Provider
      value={{ me, currentUserId, followingIds, followerIds, feedIds }}
    >
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route exact path="/accounts/login" component={LoginPage} />
        <Route exact path="/accounts/emailsignup" component={AsyncSignupPage} />
        <PrivateRoute exact path="/t/test" component={AsyncTest} />
        <PrivateRoute exact path="/" component={AsyncFeedPage} />
        <PrivateRoute exact path="/explore" component={AsyncExplorePage} />
        <PrivateRoute
          exact
          path="/:username/firstLogin"
          component={AsyncFirstLogin}
        />
        <PrivateRoute
          exact
          path="/up/:postId/:userId"
          component={AsyncUpdatePost}
        />
        <PrivateRoute exact path="/p/:postId" component={AsyncPostPage} />
        <PrivateRoute path="/accounts/edit" component={AsyncEditProfilePage} />
        <PrivateRoute exact path="/:username" component={AsyncProfilePage} />
        <Route path="*" component={AsyncNotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
    </UserContext.Provider>
  );
}

export default App;
