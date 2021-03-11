import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import handleImageUpload from "../../utils/handleImageUpload";
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import { UserContext } from "../../App";

function ProfilePicture({ size, image, isOwner }) {
  const { currentUserId } = React.useContext(UserContext);
  const classes = useProfilePictureStyles({ size, isOwner });
  const inputRef = React.useRef();
  const [img, setImg] = React.useState(image);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(
      event.target.files[0],
      "forum-competitve"
    );
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setImg(url);
  }

  function openFileInput() {
    inputRef.current.click();
  }

  return (
    <section className={classes.section}>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleUpdateProfilePic}
      />
      {image ? (
        <div
          className={classes.wrapper}
          onClick={isOwner ? openFileInput : () => null}
        >
          <img src={img} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
