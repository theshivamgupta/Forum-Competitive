import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import {
  IconButton,
  Button,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Snackbar,
  Slide,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
// import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import {
  EDIT_CODEFORCES,
  EDIT_USER,
  EDIT_USER_AVATAR,
} from "../graphql/mutations";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";
import { fetchUserhandle } from "../utils/api/CodeForces";
import Alert from "@material-ui/lab/Alert";

function EditProfilePage({ history }) {
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = React.useState(false);
  const [item, setItem] = React.useState({
    edit: true,
    changePass: false,
    changeHandle: false,
  });
  if (loading) return <LoadingScreen />;

  function handleToggleDrawer() {
    setDrawer((prev) => !prev);
  }

  function handleSelected(index) {
    switch (index) {
      case 0:
        return item.edit;
      case 1:
        return item.changePass;
      case 2:
        return item.changeHandle;
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch (index) {
      case 0:
        history.push("/accounts/edit");
        setItem((prev) => ({
          ...prev,
          edit: true,
          changePass: false,
          changeHandle: false,
        }));
        break;
      case 1:
        setItem((prev) => ({
          ...prev,
          edit: false,
          changePass: true,
          changeHandle: false,
        }));
        break;
      case 2:
        setItem((prev) => ({
          ...prev,
          edit: false,
          changePass: false,
          changeHandle: true,
        }));
        break;
      default:
        break;
    }
  }

  const options = ["Edit Profile", "Change Password", "Change CF handle"];

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
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {item.edit && <EditUserInfo user={data.users_by_pk} />}
          {item.changePass && <ChangePassword user={data.users_by_pk} />}
          {item.changeHandle && <ChangeHandle user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
}

const DEFAULT_ERROR = { type: "", message: "" };

function ChangeHandle({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const [profileImage] = React.useState(user.profile_image);
  // const [editUser] = useMutation(EDIT_USER);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(user?.codeforces_rating);
  const [alert, setAlert] = React.useState(false);
  const [editCodeforces] = useMutation(EDIT_CODEFORCES);

  async function handleUpload(username, handle, rating) {
    const variables = {
      username,
      handle,
      rating: parseInt(rating),
      lastlogin: new Date().toISOString(),
    };
    await editCodeforces({ variables });
  }

  async function onSubmit(data) {
    try {
      const response = await fetchUserhandle(data?.handle);
      if (!response) {
        setAlert(true);
        return;
      }
      setRating(response);
      await handleUpload(user?.username, data?.handle, response);
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  function handleError(err) {
    if (err.code.includes("auth")) {
      setError({ type: "email", message: err.message });
      console.log(error);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };

  return (
    <>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          Enter Valid handle!
        </Alert>
      </Snackbar>
      <section className={classes.container}>
        <div className={classes.pictureSectionItem}>
          <ProfilePicture size={38} image={profileImage} />
          <div className={classes.justifySelfStart}>
            <Typography className={classes.typography}>
              {user.username}
            </Typography>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <SectionItem
            name="handle"
            inputRef={register({
              required: true,
              minLength: 5,
              maxLength: 20,
            })}
            text="CodeForces Handle"
            formItem={user?.codeforces_handle}
          />
          <p>Rating {rating}</p>
          <div className={classes.sectionItem}>
            <div />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.justifySelfStart}
            >
              Change Handle
            </Button>
          </div>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          TransitionComponent={Slide}
          message={<span>Handle Updated!</span>}
          onClose={() => setOpen(false)}
        />
      </section>
    </>
  );
}

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const { updateEmail } = React.useContext(AuthContext);
  const [profileImage, setProfileImage] = React.useState(user.profile_image);
  const [editUser] = useMutation(EDIT_USER);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);

  async function onSubmit(data) {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError({
        type: "username",
        message: "This username is already taken.",
      });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  async function handleUpdateProfilePic(event) {
    // console.log({ event });
    const { files } = event.target;
    console.log(files[0]);
    const url = await handleImageUpload(files[0]);
    // console.log({ url });
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            accept="image/*"
            id="image"
            type="file"
            style={{ display: "none" }}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Typography
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem
          name="name"
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20,
          })}
          text="Name"
          formItem={user.name}
        />
        <SectionItem
          name="username"
          error={error}
          inputRef={register({
            required: true,
            pattern: /^[a-zA-Z0-9_.]*$/,
            minLength: 5,
            maxLength: 20,
          })}
          text="Username"
          formItem={user.username}
        />
        <SectionItem
          name="website"
          inputRef={register({
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                    protocols: ["http", "https"],
                    require_protocol: true,
                  })
                : true,
          })}
          text="Website"
          formItem={user?.website}
          // formItem={user.website}
        />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField
            name="bio"
            inputRef={register({
              maxLength: 120,
            })}
            variant="outlined"
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography
            color="textSecondary"
            className={classes.justifySelfStart}
          >
            Personal information
          </Typography>
        </div>
        <SectionItem
          name="email"
          error={error}
          inputRef={register({
            required: true,
            validate: (input) => isEmail(input),
          })}
          text="Email"
          formItem={user.email}
          type="email"
        />
        <SectionItem
          name="phoneNumber"
          inputRef={register({
            validate: (input) => (Boolean(input) ? isMobilePhone(input) : true),
          })}
          text="Phone Number"
          formItem={user.phone_number}
        />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        message={<span>Profile updated</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}

function ChangePassword({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const [profileImage, setProfileImage] = React.useState(user.profile_image);
  // const [editUser] = useMutation(EDIT_USER);
  const { updatePassword } = React.useContext(AuthContext);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);

  async function onSubmit(data) {
    try {
      // console.log(data);
      if (data.password !== data.confirm) {
        console.log("was here");
        setError({ type: "password", message: "Both Entries does not match" });
        return;
      }
      // console.log(user.email);
      await updatePassword(user.email);
      console.log("after");
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      // handleError(error);
    }
  }

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(
      event.target.files[0],
      "instagram-avatar"
    );
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            accept="image/*"
            id="image"
            type="file"
            style={{ display: "none" }}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Typography
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem
          name="password"
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20,
          })}
          text="Password"
          formItem={""}
        />
        <SectionItem
          name="confirm"
          error={error}
          inputRef={register({
            required: true,
            // pattern: /^[a-zA-Z0-9_.]*$/,
            minLength: 5,
            maxLength: 20,
          })}
          text="Confirm Password"
          formItem={""}
        />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Change Password
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        message={<span>Email Sent!!</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}

function SectionItem({
  type = "text",
  text,
  formItem,
  inputRef,
  name,
  error,
  disable = false,
}) {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        inputRef={inputRef}
        disabled={disable}
        helperText={error?.type === name && error.message}
        variant="outlined"
        fullWidth
        defaultValue={formItem}
        type={type}
        className={classes.textField}
        inputProps={{
          className: classes.textFieldInput,
        }}
      />
    </div>
  );
}

export default EditProfilePage;
