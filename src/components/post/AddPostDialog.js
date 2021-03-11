import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useAddPostDialogStyles } from "../../styles";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import copy from "copy-to-clipboard";
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  Paper,
  Avatar,
  Snackbar,
  Slide,
} from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { UserContext } from "../../App";
import serialize from "../../utils/serialize";
import handleImageUpload from "../../utils/handleImageUpload";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../../graphql/mutations";
import serialiseMd from "../../utils/serialisemd";

const shortUrl = require("node-url-shortener");

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

function AddPostDialog({ media, handleClose }) {
  const classes = useAddPostDialogStyles();
  const { me, currentUserId } = React.useContext(UserContext);
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = React.useState(initialValue);
  const [location, setLocation] = React.useState("");
  // const [image, setImage] = React.useState(null);
  const [showSnackBar, setSnackBar] = React.useState(false);
  // const [input, setInput] = React.useState(initialValue);
  const [submitting, setSubmitting] = React.useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const addImgRef = React.useRef(null);

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  async function handleSharePost() {
    setSubmitting(true);
    const url = await handleImageUpload(media);
    const variables = {
      userId: currentUserId,
      location,
      caption: serialize({ children: value }),
      media: url,
    };
    await createPost({ variables });
    setSubmitting(false);
    window.location.reload();
  }

  function handleCheetButton(e) {
    e.preventDefault();
    window.open(
      "https://dev.to/ankushsinghgandhi/markdown-cheat-sheet-1il5",
      "_blank"
    );
  }

  function handleImage(e) {
    e.preventDefault();
    addImgRef.current.click();
  }

  async function handleAddImage(e) {
    e.preventDefault();
    let urlImage = await handleImageUpload(e.target.files[0]);
    shortUrl.short(urlImage, (err, site) => {
      copy(site);
    });
    setSnackBar(true);
  }

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <ArrowBackIos onClick={handleClose} />
          <Typography align="center" variant="body1" className={classes.title}>
            New Doubt...
          </Typography>
          <Button
            color="primary"
            className={classes.share}
            disabled={submitting}
            onClick={(e) => handleCheetButton(e)}
          >
            MdCheetSheat
          </Button>
          <input
            type="file"
            style={{ display: "none" }}
            ref={addImgRef}
            onChange={handleAddImage}
          />

          <Button
            color="primary"
            className={classes.share}
            disabled={submitting}
            onClick={(e) => handleImage(e)}
          >
            Add Image
          </Button>
          <Button
            color="primary"
            className={classes.share}
            disabled={submitting}
            onClick={handleSharePost}
          >
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />

      <Paper className={classes.paper}>
        <Avatar src={me.profile_image} />
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => {
            setValue(value);
            // setInput(value);
            // console.log(value);
            // console.log(value[0].children[0].text);
          }}
        >
          <Editable
            className={classes.editor}
            placeholder="Write your caption..."
            onKeyDown={(e) => {
              if (e.key === "enter") {
                e.preventDefault();
                // editor.insertText("\n");
              }
            }}
          />
        </Slate>
        <Avatar
          src={URL.createObjectURL(media)}
          className={classes.avatarLarge}
          variant="square"
        />
      </Paper>
      <div
        className="nothing"
        style={{ height: "400px", padding: "20px", marginBottom: "16px" }}
      >
        <ReactMarkdown
          source={serialiseMd(value)}
          escapeHtml={false}
          className="markdown"
          renderers={renderers}
          onChange={(e) => console.log("yup")}
          children={serialiseMd(value)}
        />
      </div>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={2000}
        TransitionComponent={Slide}
        message={<span>Copied to Clipboard!</span>}
        onClose={() => setSnackBar(false)}
      />
    </Dialog>
  );
}

function Highlight({ value, langauge }) {
  return (
    <SyntaxHighlighter language={langauge ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
}

export default AddPostDialog;
