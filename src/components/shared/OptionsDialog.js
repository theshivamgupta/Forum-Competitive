import React from "react";
import { useOptionsDialogStyles } from "../../styles";
import { Dialog, Zoom, Button, Divider } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
// import { defaultPost } from "../../data";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/client";
import { UNFOLLOW_USER, DELETE_POST } from "../../graphql/mutations";

function OptionsDialog({ onClose, authorId, postId, onEdit }) {
  const classes = useOptionsDialogStyles();
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isOwner = authorId === currentUserId;
  const buttonText = isOwner ? "Delete" : "Unfollow";
  const onClick = isOwner ? handleDeletePost : handleUnfollowUser;
  const isFollowing = followingIds.some((id) => id === authorId);
  const isUnrelatedUser = !isOwner && !isFollowing;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const history = useHistory();

  async function handleDeletePost() {
    const variables = {
      postId,
      userId: currentUserId,
    };
    await deletePost({ variables });
    onClose();
    history.push("/");
    window.location.reload();
  }

  function handleUnfollowUser() {
    const variables = {
      userIdToFollow: authorId,
      currentUserId,
    };
    unfollowUser({ variables });
    onClose();
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      {!isUnrelatedUser && (
        <Button onClick={onClick} className={classes.redButton}>
          {buttonText}
        </Button>
      )}
      <Divider />
      <Button className={classes.button}>Copy Link</Button>
      {isOwner && <Divider />}
      {isOwner && (
        <Button onClick={onEdit} className={classes.button}>
          Edit Post
        </Button>
      )}
      <Button onClick={onClose} className={classes.button}>
        Cancel
      </Button>
    </Dialog>
  );
}

export default OptionsDialog;
