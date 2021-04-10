import React from "react";
import {
  useNavbarStyles,
  WhiteTooltip,
  RedTooltip,
  useEditProfilePageStyles,
} from "../../styles";
import {
  AppBar,
  Hidden,
  InputBase,
  Avatar,
  Fade,
  Grid,
  Typography,
  Zoom,
  IconButton,
  Drawer,
  ListItemText,
  ListItem,
  ClickAwayListener,
  List,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import {
  LoadingIcon,
  LikeIcon,
  LikeActiveIcon,
  ExploreIcon,
  ExploreActiveIcon,
  HomeIcon,
  HomeActiveIcon,
} from "../../icons";
import NotificationTooltip from "../notification/NotificationTooltip";
// import { defaultCurrentUser, getDefaultUser } from "../../data";
import NotificationList from "../notification/NotificationList";
import { useNProgress } from "@tanem/react-nprogress";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_USERS } from "../../graphql/queries";
import { UserContext } from "../../App";
import AddPostDialog from "../post/AddPostDialog";
import { isAfter } from "date-fns";
import MenuIcon from "@material-ui/icons/Menu";
function Navbar({ minimalNavbar }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const [isLoadingPage, setLoadingPage] = React.useState(true);
  const path = history.location.pathname;

  React.useEffect(() => {
    setLoadingPage(false);
  }, [path]);

  return (
    <>
      <Progress isAnimating={isLoadingPage} />
      <AppBar className={classes.appBar}>
        <section className={classes.section}>
          <Logo />
          {!minimalNavbar && (
            <>
              <Search history={history} />
              <Links path={path} />
            </>
          )}
        </section>
      </AppBar>
    </>
  );
}

function Logo() {
  const classes = useNavbarStyles();
  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <div className={classes.logoWrapper}>
          <img src={logo} alt="Cp-blog" className={classes.logo} />
        </div>
      </Link>
    </div>
  );
}

function Search({ history }) {
  const classes = useNavbarStyles();
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);

  const hasResults = Boolean(query) && results.length > 0;

  React.useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const variables = { query: `%${query}%` };
    searchUsers({ variables });
    if (data) {
      setResults(data.users);
      setLoading(false);
    }
    // setResults(Array.from({ length: 5 }, () => getDefaultUser()));
  }, [query, data, searchUsers]);

  function handleClearInput() {
    setQuery("");
  }

  return (
    <Hidden xsDown>
      <WhiteTooltip
        arrow
        interactive
        TransitionComponent={Fade}
        open={hasResults}
        title={
          hasResults && (
            <Grid className={classes.resultContainer} container>
              {results.map((result) => (
                <Grid
                  key={result.id}
                  item
                  className={classes.resultLink}
                  onClick={() => {
                    history.push(`/${result.username}`);
                    handleClearInput();
                  }}
                >
                  <div className={classes.resultWrapper}>
                    <div className={classes.avatarWrapper}>
                      <Avatar src={result.profile_image} alt="user avatar" />
                    </div>
                    <div className={classes.nameWrapper}>
                      <Typography variant="body1">{result.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
        <InputBase
          className={classes.input}
          onChange={(event) => setQuery(event.target.value)}
          startAdornment={<span className={classes.searchIcon} />}
          endAdornment={
            loading ? (
              <LoadingIcon />
            ) : (
              <span onClick={handleClearInput} className={classes.clearIcon} />
            )
          }
          placeholder="Search"
          value={query}
        />
      </WhiteTooltip>
    </Hidden>
  );
}

function Links({ path }) {
  const { me, currentUserId } = React.useContext(UserContext);
  const newNotifications = me.notifications.filter(({ created_at }) =>
    isAfter(new Date(created_at), new Date(me.last_checked))
  );
  const hasNotifications = newNotifications.length > 0;
  const classes = useNavbarStyles();
  const [showTooltip, setTooltip] = React.useState(hasNotifications);
  const [showList, setList] = React.useState(false);
  const [showAddPostDialog, setAddPostDialog] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(handleHideTooltip, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function handleToggleList() {
    setList((prev) => !prev);
  }

  function handleHideTooltip() {
    setTooltip(false);
  }

  function handleHideList() {
    setList(false);
  }

  function openFileInput() {
    setAddPostDialog(true);
    // inputRef.current.click();
  }

  function handleClose() {
    setAddPostDialog(false);
  }

  return (
    <div className={classes.linksContainer}>
      {showList && (
        <NotificationList
          notifications={me.notifications}
          handleHideList={handleHideList}
          currentUserId={currentUserId}
        />
      )}
      <Hidden xsDown>
        <div className={classes.linksWrapper}>
          {showAddPostDialog && <AddPostDialog handleClose={handleClose} />}
          {/* <Hidden xsDown> */}
          {/* <AddIcon onClick={openFileInput} /> */}
          <button
            className="bg-blue-700 p-2 px-3 rounded-xl focus:outline-none"
            onClick={openFileInput}
          >
            <p className="text-white flex justify-center items-center">
              <span>+</span>Write
            </p>
          </button>
          {/* </Hidden> */}
          <Link to="/">{path === "/" ? <HomeActiveIcon /> : <HomeIcon />}</Link>
          <Link to="/explore">
            {path === "/explore" ? <ExploreActiveIcon /> : <ExploreIcon />}
          </Link>
          <RedTooltip
            arrow
            open={showTooltip}
            onOpen={handleHideTooltip}
            TransitionComponent={Zoom}
            title={<NotificationTooltip notifications={newNotifications} />}
          >
            <div
              className={hasNotifications ? classes.notifications : ""}
              onClick={handleToggleList}
            >
              {showList ? <LikeActiveIcon /> : <LikeIcon />}
            </div>
          </RedTooltip>
          <Link to={`/${me.username}`}>
            <div
              className={
                path === `/${me.username}` ? classes.profileActive : ""
              }
            ></div>
            <Avatar src={me.profile_image} className={classes.profileImage} />
          </Link>
        </div>
      </Hidden>

      <Hidden smUp>
        <Menu me={me} />
      </Hidden>
    </div>
  );
}

function Menu({ me }) {
  const classes = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = React.useState(false);
  const history = useHistory();
  const path = history.location.pathname;
  // console.log({ path });
  function handleShowDrawer(e) {
    e.preventDefault();
    setDrawer((prev) => !prev);
  }

  function handleSelected(index) {
    switch (index) {
      case 0:
        return false;
      case 1:
        return !path.includes("explore") && !path.includes(`${me.username}`);
      case 2:
        return path.includes("explore");
      case 3:
        return path.includes(`${me.username}`);
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch (index) {
      case 0:
        // history.push("/accounts/edit");
        break;
      case 1:
        history.push("/");
        break;
      case 2:
        history.push("/explore");
        break;
      case 3:
        history.push(`/${me.username}`);
        break;
      default:
        break;
    }
  }

  const options = ["Write", "Home", "Explore", "Profile"];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <IconButton edge="end" onClick={handleShowDrawer}>
      <MenuIcon />
      <Drawer
        variant="temporary"
        anchor="left"
        open={showDrawer}
        onClose={handleShowDrawer}
        classes={{ paperAnchorLeft: classes.temporaryDrawer }}
      >
        {drawer}
      </Drawer>
    </IconButton>
  );
}

function Progress({ isAnimating }) {
  const classes = useNavbarStyles();
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <div
      className={classes.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className={classes.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div className={classes.progressBackground} />
      </div>
    </div>
  );
}

export default Navbar;
