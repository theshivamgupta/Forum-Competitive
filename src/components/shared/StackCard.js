import {
  Avatar,
  Divider,
  Grid,
  Hidden,
  Paper,
  Typography,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React from "react";
import { Link } from "react-router-dom";
import { useStackCardStyles } from "../../styles";
import { formatDateToNow } from "../../utils/formatDate";
import "../../assets/StackCard.css";

function StackCard({ post, user }) {
  const likeCount = post?.likes_aggregate.aggregate?.count;
  const classes = useStackCardStyles();

  return (
    <div>
      <Paper
        // className={classes.stackitem}
        className="stackitem-profile"
        elevation={1}
      >
        <Grid
          // className={classes.maingrid}
          className="maingrid-profile"
          container
          spacing={2}
        >
          <Grid
            // className={classes.usericon}
            className="usericon-profile"
            item
            xs={3}
            sm={2}
          >
            <Avatar
              // className={classes.avatar}
              className="avatar-profile"
              alt="Remy Sharp"
              src={user?.profile_image}
            />
            <Hidden smDown>
              <Typography
                // className={classes.user}
                className="user-profile"
                variant="caption"
              >
                {user?.name}
              </Typography>
            </Hidden>
          </Grid>
          <Grid
            // className={classes.post}
            className="post-profile"
            item
            xs={9}
            sm={8}
          >
            <Divider
              className={classes.divider}
              orientation="vertical"
              flexItem
              light
            />
            <div className={classes.mainpost}>
              <Link to={`/p/${post?.id}`}>
                <Typography className={classes.content}>
                  {post?.media}
                </Typography>
                <Typography className={classes.timestamp}>
                  Posted {formatDateToNow(post?.created_at)}
                </Typography>
              </Link>
            </div>
            <Hidden smDown>
              <Divider
                className={classes.divider}
                orientation="vertical"
                flexItem
                light
              />
            </Hidden>
          </Grid>
          <Hidden smDown>
            <Grid className={classes.likes} item sm={2}>
              <FavoriteIcon className={classes.likeicon} />
              <Typography className={classes.likecount}>{likeCount}</Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </div>
  );
}

export default StackCard;
