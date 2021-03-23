import React from "react";
import { useNotificationListStyles } from "../../styles";
// import { defaultNotifications } from "../../data";
import { Grid, Avatar, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import FollowButton from "../shared/FollowButton";
import useOutsideClick from "@rooks/use-outside-click";
import { useMutation } from "@apollo/client";
import { CHECK_NOTIFICATIONS } from "../../graphql/mutations";
import { formatDateToNowShort } from "../../utils/formatDate";
import { deepOrange } from "@material-ui/core/colors";

const useColor = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

function NotificationList({ handleHideList, notifications, currentUserId }) {
  const classes = useNotificationListStyles();
  const colorClass = useColor();
  const listContainerRef = React.useRef();
  useOutsideClick(listContainerRef, handleHideList);
  const [checkNotifications] = useMutation(CHECK_NOTIFICATIONS);

  React.useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString(),
    };
    checkNotifications({ variables });
  }, [currentUserId, checkNotifications]);

  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {notifications.map((notification) => {
        const isLike = notification.type === "like";
        const isFollow = notification.type === "follow";

        return (
          <Grid key={notification.id} item className={classes.listItem}>
            <div className={classes.listItemWrapper}>
              <div className={classes.avatarWrapper}>
                <Avatar
                  src={notification.user.profile_image}
                  alt="User avatar"
                />
              </div>
              <div className={classes.nameWrapper}>
                <Link to={`/${notification.user.username}`}>
                  <Typography variant="body1">
                    {notification.user.username}
                  </Typography>
                </Link>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.typography}
                >
                  {isLike &&
                    `likes your photo. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                  {isFollow &&
                    `started following you. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                </Typography>
              </div>
            </div>
            <div>
              {isLike && (
                <Link to={`/p/${notification?.post?.id}`}>
                  <Avatar className={colorClass.orange}>
                    {notification.post?.media[0]}
                  </Avatar>
                  {/* <Avatar src={notification.post?.media} alt="post cover" /> */}
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id} />}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NotificationList;
