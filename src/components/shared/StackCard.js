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

function StackCard({ post, user }) {
  const likeCount = post?.likes_aggregate.aggregate?.count;
  const classes = useStackCardStyles();

  return (
    <div>
      <Paper className={classes.stackitem} elevation={1}>
        <Grid className={classes.maingrid} container spacing={2}>
          <Grid className={classes.usericon} item xs={3} sm={2}>
            <Avatar
              className={classes.avatar}
              alt="Remy Sharp"
              src={user?.profile_image}
            />
            <Hidden smDown>
              <Typography className={classes.user} variant="caption">
                {user?.name}
              </Typography>
            </Hidden>
          </Grid>
          <Grid className={classes.post} item xs={9} sm={8}>
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
