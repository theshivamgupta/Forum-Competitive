import React from "react";
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import FeedPage from "./pages/feed";
import ExplorePage from "./pages/explore";
import ProfilePage from "./pages/profile";
import PostPage from "./pages/post";
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import NotFoundPage from "./pages/not-found";
import PostModal from "./components/post/PostModal";
import { AuthContext } from "./auth";
import { useSubscription } from "@apollo/client";
import { ME } from "./graphql/subscriptions";
import LoadingScreen from "./components/shared/LoadingScreen";
import FirstLogin from "./pages/firstLogin";

export const UserContext = React.createContext();

function App() {
  const { authState } = React.useContext(AuthContext);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };
  const { data, loading } = useSubscription(ME, { variables });
  // const stuff = useSubscription(ME, { variables });
  // console.log({ stuff });
  // console.log({ ME });
  // console.log({ isAuth });
  // console.log({ variables });
  // console.log({ data });
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
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }

  const isModalOpen = modal && prevLocation.current !== location;
  const me = isAuth && data ? data.users[0] : null;
  // console.log(data.users);
  // console.log({ me });
  const currentUserId = me.id;
  const followingIds = me.followings.map(({ user }) => user.id);
  const followerIds = me.followers.map(({ user }) => user.id);
  const feedIds = [...followingIds, currentUserId];

  return (
    <UserContext.Provider
      value={{ me, currentUserId, followingIds, followerIds, feedIds }}
    >
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route exact path="/" component={FeedPage} />
        <Route exact path="/explore" component={ExplorePage} />
        <Route exact path="/:username/firstLogin" component={FirstLogin} />
        <Route exact path="/:username" component={ProfilePage} />
        <Route exact path="/p/:postId" component={PostPage} />
        <Route path="/accounts/edit" component={EditProfilePage} />
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
    </UserContext.Provider>
  );
}

export default App;
