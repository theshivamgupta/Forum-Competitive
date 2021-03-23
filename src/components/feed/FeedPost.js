import React from "react";
import { useFeedPostStyles } from "../../styles";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  RemoveIcon,
  SaveIcon,
  LoadingIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import { Button, Divider, TextField } from "@material-ui/core";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import { formatDateToNow } from "../../utils/formatDate";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import "./Post.css";
// import Img from "react-graceful-image";
import {
  SAVE_POST,
  UNSAVE_POST,
  LIKE_POST,
  UNLIKE_POST,
  CREATE_COMMENT,
} from "../../graphql/mutations";
import { GET_FEED } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { UserContext } from "../../App";
import { GET_POST } from "../../graphql/queries";
import OptionsDialog from "../shared/OptionsDialog";
import UserCard from "../shared/UserCard";
import FollowSuggestions from "../shared/FollowSuggestions";
function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  // const [showCaption, setCaption] = React.useState(false);
  const [showOptionsDialog, setOptionsDialog] = React.useState(false);
  const { currentUserId } = React.useContext(UserContext);
  const {
    id,
    media,
    likes,
    likes_aggregate,
    saved_posts,
    user,
    caption,
    comments,
    comments_aggregate,
    created_at,
  } = post;

  const postId = id;

  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  if (loading) return <LoadingIcon />;

  const showFollowSuggestions = index === 1;
  const likesCount = likes_aggregate.aggregate.count;
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);

  const Icon = isAlreadyLiked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;

  return (
    <>
      <article
        // className={classes.article}
        className="container-container"
        style={{ marginBottom: showFollowSuggestions && 30 }}
      >
        <div className="container">
          {/* <Link to={`/${data?.posts_by_pk?.user?.username}`}> */}
          <div className="image-container">
            <UserCard user={user} />
          </div>
          {/* </Link> */}
          <div className="content-container">
            <Link to={`/p/${id}`}>
              <div className="title-container">{media}</div>
              <div className="time-container">
                {formatDateToNow(created_at)}
              </div>
            </Link>
          </div>
          <div className="like-container">
            {/* <img src={} alt="like" className="image" /> */}
            <Icon className="image" />
            {/* <LikeButton likes={likes} postId={id} authorId={user.id} /> */}

            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </div>
        </div>
      </article>
    </>
  );
}

function LikeButton({ likes, postId, authorId }) {
  const classes = useFeedPostStyles();
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  // const Icon = liked ? UnlikeIcon : LikeIcon;
  const Icon = isAlreadyLiked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
  };

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });
    // console.log({ result, data });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === "likes_mutation_response" ? 1 : -1;
    const posts = data.posts.map((post) => ({
      ...post,
      likes_aggregate: {
        ...post.likes_aggregate,
        aggregate: {
          ...post.likes_aggregate.aggregate,
          count: post.likes_aggregate.aggregate.count + count,
        },
      },
    }));
    cache.writeQuery({ query: GET_FEED, data: { posts } });
  }

  function handleLike() {
    // console.log("like");
    setLiked(true);
    likePost({ variables, update: handleUpdate });
  }

  function handleUnlike() {
    // console.log("unlike");
    setLiked(false);
    unlikePost({ variables, update: handleUpdate });
  }

  return <Icon className="image" onClick={onClick} />;
}

function SaveButton({ postId, savedPosts }) {
  const classes = useFeedPostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;
  const [savePost] = useMutation(SAVE_POST);
  const [removePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId,
  };

  function handleSave() {
    // console.log("save");
    setSaved(true);
    savePost({ variables });
  }

  function handleRemove() {
    setSaved(false);
    removePost({ variables });
  }

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId }) {
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const classes = useFeedPostStyles();
  const [content, setContent] = React.useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });
    const oldComment = result.data.insert_comments.returning[0];
    const newComment = {
      ...oldComment,
      user: { ...oldComment.user },
    };
    const posts = data.posts.map((post) => {
      const newPost = {
        ...post,
        comments: [...post.comments, newComment],
        comments_aggregate: {
          ...post.comments_aggregate,
          aggregate: {
            ...post.comments_aggregate.aggregate,
            count: post.comments_aggregate.aggregate.count + 1,
          },
        },
      };
      return post.id === postId ? newPost : post;
    });
    cache.writeQuery({ query: GET_FEED, data: { posts } });
    setContent("");
  }

  function handleAddComment() {
    const variables = {
      content,
      postId,
      userId: currentUserId,
    };
    createComment({ variables, update: handleUpdate });
  }

  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment..."
        multiline
        rowsMax={2}
        rows={1}
        onChange={(event) => setContent(event.target.value)}
        className={classes.textField}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline,
          },
        }}
      />
      <Button
        onClick={handleAddComment}
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  );
}

export default FeedPost;
