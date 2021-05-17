import React from "react";
// import { useFeedPostsStyles } from "../../styles";
import { LoadingIcon } from "../../icons";
import { Link } from "react-router-dom";
import { Avatar, Grid, Hidden, Paper, Typography } from "@material-ui/core";
import { formatDateToNow } from "../../utils/formatDate";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import { useQuery } from "@apollo/client";
import { UserContext } from "../../App";
import { GET_POST } from "../../graphql/queries";
import { useMediaQuery } from "react-responsive";
import "../../assets/StackCard.css";

function FeedPost({ post, index }) {
  // const [showCaption, setCaption] = React.useState(false);
  // const [showOptionsDialog, setOptionsDialog] = React.useState(false);
  const { currentUserId } = React.useContext(UserContext);
  const { id, media, likes, likes_aggregate, created_at } = post;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 560px)" });
  const postId = id;
  // const classes = useFeedPostsStyles();
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  if (loading) return <LoadingIcon />;

  const likesCount = likes_aggregate.aggregate.count;
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);

  return (
    <div>
      <Paper
        // className={classes.stackitem}
        className="stackitem"
        elevation={1}
        style={{ width: isTabletOrMobile ? "380px" : "900px" }}
      >
        <Grid
          // className={classes.maingrid}
          className="maingrid"
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
            <Link to={`/${data?.posts_by_pk?.user?.username}`}>
              <Avatar
                // className={classes.avatar}
                className="avatar-profile"
                alt="UserImage"
                src={data?.posts_by_pk?.user?.profile_image}
              />
              <Hidden smDown>
                <Typography
                  // className={classes.user}
                  className="user-profile"
                  variant="caption"
                >
                  {data?.posts_by_pk?.user?.username}
                </Typography>
              </Hidden>
            </Link>
          </Grid>
          <Grid
            // className={classes.post}
            className="post-profile"
            item
            xs={9}
            sm={8}
          >
            <div
              // className={classes.mainpost}
              className="mainpost-profile"
            >
              <Link to={`/p/${data?.posts_by_pk?.id}`}>
                <Typography
                  // className={classes.content}
                  className="content-profile"
                >
                  {media}
                </Typography>
                <Typography
                  // className={classes.timestamp}
                  className="timestamp-profile"
                >
                  Posted {formatDateToNow(created_at)}
                </Typography>
              </Link>
            </div>
          </Grid>
          <Hidden smDown>
            <Grid
              // className={classes.likes}
              className="likes-profile"
              item
              sm={2}
            >
              {isAlreadyLiked ? (
                <FavoriteIcon
                  // className={classes.likeicon}
                  className="likeicon-profile"
                  style={{ color: "#F23A3A" }}
                />
              ) : (
                <FavoriteBorderIcon
                  // className={classes.likeicon}
                  className="likeicon-profile"
                />
              )}
              <Typography
                // className={classes.likecount}
                className="likecount-profile"
              >
                {likesCount === 1 ? "1 like" : `${likesCount} likes`}
              </Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </div>
  );
}

export default FeedPost;
