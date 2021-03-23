import React from "react";
import "./Post.css";

import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  RemoveIcon,
  SaveIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
// import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";
import { useSubscription, useMutation } from "@apollo/client";
import { GET_POST } from "../../graphql/subscriptions";
import { UserContext } from "../../App";
import {
  LIKE_POST,
  UNLIKE_POST,
  SAVE_POST,
  UNSAVE_POST,
  CREATE_COMMENT,
} from "../../graphql/mutations";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";
import Img from "react-graceful-image";
import { Scrollbar } from "react-scrollbars-custom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

function Post({ postId }) {
  // const [loading, setLoading] = React.useState(true);
  // React.useEffect(() => window.location.reload(), []);
  const [openDialog, setDialog] = React.useState(false);
  const { currentUserId } = React.useContext(UserContext);
  const variables = { postId };
  const { data, loading } = useSubscription(GET_POST, { variables });
  // console.log(data);
  // setTimeout(() => setLoading(false), 2000);
  if (loading) return <PostSkeleton />;
  const {
    id,
    media,
    likes,
    likes_aggregate,
    user,
    caption,
    comments,
    created_at,
  } = data.posts_by_pk;
  const likesCount = likes_aggregate.aggregate.count;
  const commentCount = comments.length;

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  function handleDialog(e) {
    e.preventDefault();
    setDialog((prev) => !prev);
  }

  return (
    <div className="app-container">
      <Paper className="container" square elevation={3}>
        <Scrollbar style={{ width: "100%", height: "100%" }}>
          <div className="card-container">
            <div className="back-container">
              <Link to={`/`}>
                <ArrowBackIosIcon
                  style={{ marginTop: "1px", fontSize: "small" }}
                />
                <span>Back</span>
              </Link>
            </div>
            <div className="title-container">{media}</div>
            <div className="like-container">
              {/* <ThumbUpAltOutlinedIcon style={{ marginRight: "10px" }} /> */}
              <LikeButton likes={likes} postId={id} authorId={user.id} />
              {/* <div></div> */}
              <span>{`${likesCount} likes`}</span>
            </div>
          </div>
          <div className="content-container">
            <div className="user-detail-container">
              <div className="image">
                <Link to={`/${user.username}`}>
                  <Avatar
                    src={user.profile_image}
                    alt="avatar"
                    variant="circular"
                  />
                </Link>
              </div>
              <div className="post-detail">
                <p>{user?.username}</p>
                <p>{`Created At: ${formatPostDate(created_at)}`}</p>
                <MoreIcon onClick={handleDialog} />
              </div>
            </div>
          </div>
          <div className="post-container">
            <ReactMarkdown
              source={caption}
              escapeHtml={false}
              className="markdown"
              renderers={renderers}
            />
          </div>
        </Scrollbar>
      </Paper>
      <Paper className="post-comment-container">
        <div className="comment-container">
          <CommentOutlinedIcon fontSize="small" className="comment-icon" />
          <Typography variant="caption" className="comment-typography">
            {`Comments: ${commentCount}`}
          </Typography>
        </div>
      </Paper>
      <Paper className="textarea-container">
        <Comment postId={id} comments={comments} />
      </Paper>
      {openDialog && (
        <OptionsDialog
          postId={id}
          authorId={user.id}
          onClose={() => setDialog(false)}
        />
      )}
    </div>
  );
}

function AuthorCaption({ user, caption, createdAt }) {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column " }}>
        <Link to={user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </div>
    </div>
  );
}

function UserComment({ comment }) {
  const classes = usePostStyles();

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  return (
    <div>
      <div className="comment-card">
        <div className="avatar">
          <Avatar
            src={comment?.user?.profile_image}
            alt="avatar"
            variant="circular"
          />
        </div>
        <div className="author-details">
          <Typography variant="caption">{comment?.user?.username}</Typography>
          <Typography variant="caption">
            {formatPostDate(comment.created_at)}
          </Typography>
        </div>
      </div>
      <div className="comment-md">
        <ReactMarkdown
          source={comment.content}
          escapeHtml={false}
          className="markdown"
          renderers={renderers}
        />
      </div>
      <Divider />
    </div>
  );
}

function LikeButton({ likes, authorId, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
  };

  function handleLike() {
    // console.log("like");
    setLiked(true);
    likePost({ variables });
  }

  function handleUnlike() {
    // console.log("unlike");
    setLiked(false);
    unlikePost({ variables });
  }

  return <Icon className={className} onClick={onClick} />;
}

function SaveButton({ savedPosts, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
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
    // console.log("remove");
    setSaved(false);
    unsavePost({ variables });
  }

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId, comments }) {
  // const classes = usePostStyles();
  const [value, setValue] = React.useState("");
  const [showPreview, setPreview] = React.useState(false);
  const { currentUserId } = React.useContext(UserContext);
  const [createComment] = useMutation(CREATE_COMMENT);

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  function handleAddComment() {
    const variables = {
      content: value,
      postId,
      userId: currentUserId,
    };
    createComment({ variables });
    setValue("");
  }

  function handlePreview(e) {
    e.preventDefault();
    setPreview((prev) => !prev);
  }

  return (
    <div>
      <div>
        {!showPreview && (
          <TextField
            placeholder="Type your comment here... Markdown is supported"
            multiline
            rows={5}
            rowsMax={Infinity}
            style={{ width: "100%" }}
            variant="outlined"
            // InputProps={{ disableUnderline: true }}
            onChange={(e) => setValue(e.target.value)}
            defaultValue={value}
            color="primary"
          />
        )}
      </div>
      <div>
        {showPreview && (
          <ReactMarkdown
            source={value}
            escapeHtml={false}
            className="markdown"
            renderers={renderers}
          />
        )}
      </div>
      <div>
        <Button
          color="primary"
          style={{ marginRight: "800px" }}
          onClick={handlePreview}
          disabled={!value.trim()}
        >
          Preview
        </Button>
        <Button
          color="primary"
          disabled={!value.trim()}
          onClick={handleAddComment}
        >
          Post
        </Button>
      </div>
      <div style={{ width: "100%" }}>
        {/* <div className="comment-card">
            <div className="avatar">
              <Avatar
                src={comments?.user?.profile_image}
                alt="avatar"
                variant="circular"
              />
            </div>
            <div className="author-details">
              <Typography variant="caption">happykimi</Typography>
              <Typography variant="caption">June 13, 2018 10:27 AM</Typography>
            </div>
          </div>
          <div className="comment-md">
            <ReactMarkdown
              source={comments.content}
              escapeHtml={false}
              className="markdown"
              renderers={renderers}
            />
          </div>
          <Divider /> */}
        {comments.map((comment) => (
          <UserComment key={comment.id} comment={comment} />
        ))}
      </div>
      {/* <div style={{ padding: "15px", margin: "80px 0px" }}></div> */}
    </div>
  );
}

function Highlight({ value, langauge }) {
  return (
    <SyntaxHighlighter language={langauge ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
}

export default Post;
