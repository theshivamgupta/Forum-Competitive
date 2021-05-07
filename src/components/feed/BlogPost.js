import { Avatar } from "@material-ui/core";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { formatPostDate } from "../../utils/formatDate";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import gfm from "remark-gfm";
import { UserContext } from "../../App";
import { usePostStyles } from "../../styles";
import { useMutation } from "@apollo/client";
import { LIKE_POST, UNLIKE_POST } from "../../graphql/mutations";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

function BlogPost({ postData }) {
  const {
    media,
    user,
    caption,
    created_at,
    likes,
    likes_aggregate,
    id,
  } = postData;
  const likesCount = likes_aggregate.aggregate.count;
  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  return (
    <div className="p-3">
      <div className="mt-8 mx-auto" style={{ width: "900px" }}>
        <div className="prose lg:prose-lg xl:prose-xl mt-10 mb-10 mx-auto">
          <h1>{media}</h1>
        </div>
        <div className="relative z-10 py-5 mb-5 border-t border-b md:mb-10 dark:border-brand-grey-800">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-start md:items-center">
              <div className="w-12 h-12 mr-2 rounded-full md:w-16 md:h-16 md:mr-5">
                <Link
                  to={`/${user.username}`}
                  className="block w-full h-auto relative bg-brand-grey-200 dark:bg-brand-dark-grey-900"
                >
                  <Avatar src={user.profile_image} />
                </Link>
              </div>
              <div className="leading-snug">
                <Link
                  to={`/${user.username}`}
                  className="mb-1 text-lg font-bold text-brand-black dark:text-white"
                >
                  <span>{user.name}</span>
                </Link>
                <p className="mb-2 text-sm text-brand-grey-600 dark:text-brand-grey-400">
                  Published on{" "}
                  <span className="font-semibold">
                    {formatPostDate(created_at)}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <div className="flex flex-row">
                <div className="relative">
                  <div
                    aria-label="Post actions dropdown"
                    className="flex flex-row items-center button-transparent small"
                  >
                    <LikeButton likes={likes} postId={id} authorId={user.id} />
                    <span className="hidden ml-2 md:inline-block">
                      {likesCount === 1 ? "1 like" : `${likesCount} likes`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReactMarkdown
          source={caption}
          escapeHtml={false}
          className="prose mx-auto md:prose-lg lg:prose-xl prose-blue"
          style={{ width: "150%" }}
          renderers={renderers}
          plugins={[gfm]}
          onChange={(e) => console.log("yup")}
          children={caption}
        />
      </div>
    </div>
  );
}

function LikeButton({ likes, authorId, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? FavoriteIcon : FavoriteBorderIcon;
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

  return (
    <Icon
      className={className}
      onClick={onClick}
      style={{ color: isAlreadyLiked && "#F23A3A" }}
    />
  );
}

function Highlight({ value, langauge }) {
  return (
    <SyntaxHighlighter language={langauge ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
}

export default BlogPost;
