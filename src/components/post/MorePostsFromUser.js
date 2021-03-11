import React from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { Typography } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
// import { getDefaultPost, defaultUser } from "../../data";
import GridPost from "../shared/GridPost";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_POST, GET_MORE_POSTS_FROM_USER } from "../../graphql/queries";

function MorePostsFromUser({ postId }) {
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  const [
    getMorePostsFromUser,
    { data: morePosts, loading: loading2 },
  ] = useLazyQuery(GET_MORE_POSTS_FROM_USER);
  const classes = useMorePostsFromUserStyles();

  React.useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  // let loading = false;

  return (
    <div className={classes.container}>
      {loading || loading2 ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            className={classes.typography}
          >
            More Posts from{" "}
            <Link
              to={`/${data.posts_by_pk.user.username}`}
              className={classes.link}
            >
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>
          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default MorePostsFromUser;
