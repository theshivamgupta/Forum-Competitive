import React from "react";
import {
  useProfilePageStyles,
  useProfileSideStyles,
  useProfileMainStyles,
  useStackCardStyles,
} from "../styles";
import Layout from "../components/shared/Layout";
import {
  Hidden,
  Button,
  Typography,
  Dialog,
  Zoom,
  Divider,
  DialogTitle,
  Avatar,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../auth";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_USER_PROFILE } from "../graphql/queries";
import {
  EDIT_USER_BANNER,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/mutations";
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { color } from "../utils/color";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import handleImageUpload from "../utils/handleImageUpload";
// import UserStackCard from "../components/profile/UserStackCard";
const StackCard = React.lazy(() => import("../components/shared/StackCard"));
const UserStackCard = React.lazy(() =>
  import("../components/profile/UserStackCard")
);
function ProfilePage() {
  const { username } = useParams();
  const { currentUserId, me } = React.useContext(UserContext);
  // console.log(me);
  const [activeTab, setActiveTab] = React.useState({
    profile: true,
    followers: false,
    followings: false,
  });

  const variables = { username };
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables,
    fetchPolicy: "no-cache",
  });
  if (loading) return <LoadingScreen />;
  const [user] = data.users;
  // console.log(user);
  const isOwner = user?.id === currentUserId;

  return (
    <Layout
      title={`${user.name} (@${user.username})`}
      style={{ margin: "0 auto" }}
    >
      <Container>
        <ProfileMainCard
          user={user}
          isOwner={isOwner}
          setActiveTab={setActiveTab}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ProfileSideCard user={user} />
          </Grid>
          <Grid item xs={12} md={8}>
            {activeTab.profile &&
              user?.posts.map((post) => {
                return (
                  <React.Suspense
                    key={post?.id}
                    fallback={<FeedPostSkeleton />}
                  >
                    <StackCard post={post} user={user} />
                  </React.Suspense>
                );
              })}
            {activeTab.followers &&
              me?.followers.map((follower) => {
                return (
                  <React.Suspense
                    key={follower?.user?.id}
                    fallback={<FeedPostSkeleton />}
                  >
                    <UserStackCard friend={follower} />
                  </React.Suspense>
                );
              })}
            {activeTab.followings &&
              me?.followings.map((following) => {
                return (
                  <React.Suspense
                    key={following?.user?.id}
                    fallback={<FeedPostSkeleton />}
                  >
                    <UserStackCard friend={following} />
                  </React.Suspense>
                );
              })}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

function ProfileMainCard({ user, isOwner, setActiveTab }) {
  const classes = useProfileMainStyles();
  const { me } = React.useContext(UserContext);
  const defaultBanner =
    "https://img5.goodfon.com/wallpaper/nbig/7/64/abstract-background-rounded-shapes-colorful-abstraktsiia-tek.jpg";
  console.log({ isOwner });
  const [value, setValue] = React.useState(0);
  const [showOption, setShowOption] = React.useState(false);
  const [showUnfollowDialog, setUnfollowDialog] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState(
    user?.banner === null ? defaultBanner : user?.banner
  );
  const coverImgRef = React.useRef(null);
  const { currentUserId, followingIds, followerIds } = React.useContext(
    UserContext
  );
  const isAlreadyFollowing = followingIds.some((id) => id === user.id);
  const [isFollowing, setFollowing] = React.useState(isAlreadyFollowing);
  const isFollower = !isFollowing && followerIds.some((id) => id === user.id);
  const variables = {
    userIdToFollow: user.id,
    currentUserId,
  };
  const [followUser] = useMutation(FOLLOW_USER);
  const [editUserBanner] = useMutation(EDIT_USER_BANNER);

  let followButton;
  // const isFollowing = true;
  if (isFollowing) {
    followButton = (
      <Button
        onClick={() => setUnfollowDialog(true)}
        variant="outlined"
        className={classes.button}
      >
        Following
      </Button>
    );
  } else if (isFollower) {
    followButton = (
      <Button
        onClick={handleFollowUser}
        variant="contained"
        color="primary"
        className={classes.button}
        style={{
          fontSize: "12px",
        }}
      >
        Follow Back
      </Button>
    );
  } else {
    followButton = (
      <Button
        onClick={handleFollowUser}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Follow
      </Button>
    );
  }

  function handleFollowUser() {
    setFollowing(true);
    followUser({ variables });
  }

  const onUnfollowUser = React.useCallback(() => {
    setUnfollowDialog(false);
    setFollowing(false);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleCloseMenu() {
    setShowOption(false);
  }

  async function handleUpdateProfilePic(event) {
    // console.log({ event });
    const { files } = event.target;
    // console.log(files[0]);
    const url = await handleImageUpload(files[0]);
    // console.log({ url });
    const variables = { id: user.id, bannerImage: url };
    await editUserBanner({ variables });
    setBannerImage(url);
  }

  return (
    <div>
      <Paper className={classes.covercard}>
        <Grid className={classes.cover} container>
          <Grid
            className={classes.coverimg}
            item
            xs={12}
            onClick={() => {
              if (isOwner) coverImgRef.current.click();
            }}
            style={{
              background: `url(${bannerImage}) no-repeat center center`,
            }}
          ></Grid>
          {isOwner && (
            <input
              type="file"
              ref={coverImgRef}
              className="hidden"
              accept="image/*"
              onChange={handleUpdateProfilePic}
            />
          )}
          <Grid className={classes.profile} item xs={12}>
            <Grid style={{ height: "100%", width: "100%" }} container>
              <Grid className={classes.profilepic} item xs={4} md={3}>
                <Avatar
                  className={classes.profileimg}
                  alt="John Doe"
                  src={user.profile_image}
                ></Avatar>
              </Grid>
              <Grid className={classes.profileinfo} item xs={7} md={6}>
                <Grid container style={{ width: "100%", height: "100%" }}>
                  <Grid item xs={12}>
                    <Typography className={classes.name}>
                      {user?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.username}>
                      {user?.username}
                    </Typography>
                    <Typography
                      className={classes.codeforces}
                      style={{
                        color: `${color(user?.codeforces_rating)}`,
                        fontWeight: "700",
                      }}
                    >
                      {`(${user?.codeforces_handle})`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.bio}>{user?.bio}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid className={classes.coverButtons} item xs={1} md={3}>
                <div className={classes.editprofile}>
                  <Hidden smDown>
                    {isOwner ? (
                      <Link to="/accounts/edit">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<EditOutlinedIcon />}
                        >
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <>{followButton}</>
                    )}
                  </Hidden>
                  <div onClick={() => setShowOption((prev) => !prev)}>
                    <svg
                      aria-label="Options"
                      className={classes.settings}
                      fill="#262626"
                      height="24"
                      viewBox="0 0 48 48"
                      width="24"
                    >
                      <path
                        clipRule="evenodd"
                        d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.navigation} xs={12}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                className={classes.navtab}
                label="Profile"
                onClick={() => {
                  setActiveTab((prev) => ({
                    ...prev,
                    profile: true,
                    followers: false,
                    followings: false,
                  }));
                }}
              />
              <Tab
                className={classes.navtab}
                label="Followers"
                onClick={() => {
                  setActiveTab((prev) => ({
                    ...prev,
                    profile: false,
                    followers: true,
                    followings: false,
                  }));
                }}
              />
              <Tab
                className={classes.navtab}
                label="Following"
                onClick={() => {
                  setActiveTab((prev) => ({
                    ...prev,
                    profile: false,
                    followers: false,
                    followings: true,
                  }));
                }}
              />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>
      {showOption && <OptionsMenu handleCloseMenu={handleCloseMenu} />}
      {showUnfollowDialog && (
        <UnfollowDialog
          onUnfollowUser={onUnfollowUser}
          user={user}
          onClose={() => setUnfollowDialog(false)}
        />
      )}
    </div>
  );
}

function ProfileSideCard({ user }) {
  const classes = useProfileSideStyles();

  return (
    <div>
      <Paper className={classes.sidecard} elevation={3}>
        <Grid className={classes.frienddata} container spacing={1}>
          <Grid className={classes.data} item xs={3}>
            <Typography className={classes.friends}>Followers</Typography>
          </Grid>
          <Grid className={classes.data} item xs={3}>
            <Typography className={classes.number}>
              {user[`followers_aggregate`]?.aggregate?.count}
            </Typography>
          </Grid>
          <Grid className={classes.data} item xs={3}>
            <Typography className={classes.friends}>Following</Typography>
          </Grid>
          <Grid className={classes.data} item xs={3}>
            <Typography className={classes.number}>
              {user[`followings_aggregate`]?.aggregate?.count}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

function UnfollowDialog({ onClose, user, onUnfollowUser }) {
  const classes = useProfilePageStyles();
  const { currentUserId } = React.useContext(UserContext);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  function handleUnfollowUser() {
    const variables = {
      userIdToFollow: user.id,
      currentUserId,
    };
    unfollowUser({ variables });
    onUnfollowUser();
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          className={classes.avatar}
        />
      </div>
      <Typography
        align="center"
        variant="body2"
        className={classes.unfollowDialogText}
      >
        Unfollow @{user.username}?
      </Typography>
      <Divider />
      <Button onClick={handleUnfollowUser} className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  );
}

function OptionsMenu({ handleCloseMenu }) {
  const classes = useProfilePageStyles();
  const { signOut } = React.useContext(AuthContext);
  const [showLogOutMessage, setLogOutMessage] = React.useState(false);
  const history = useHistory();
  const client = useApolloClient();

  function handleLogOutClick() {
    setLogOutMessage(true);
    setTimeout(async () => {
      await client.clearStore();
      signOut();
      history.push("/accounts/login");
    }, 2000);
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.dialogPaper,
      }}
      TransitionComponent={Zoom}
    >
      {showLogOutMessage ? (
        <DialogTitle className={classes.dialogTitle}>
          Logging Out
          <Typography color="textSecondary">
            You need to log back in to continue using CodeBlog
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsItem text="Log Out" onClick={handleLogOutClick} />
          <OptionsItem text="Cancel" onClick={handleCloseMenu} />
        </>
      )}
    </Dialog>
  );
}

function OptionsItem({ text, onClick }) {
  return (
    <>
      <Button style={{ padding: "12px 8px" }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  );
}

export default ProfilePage;
