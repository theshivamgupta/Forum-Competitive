import { useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useHistory, useParams } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import gfm from "remark-gfm";
import { EDIT_POST } from "../graphql/mutations";
import { FETCH_POST } from "../graphql/queries";

function Highlight({ value, langauge }) {
  return (
    <SyntaxHighlighter language={langauge ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
}

function UpdatePost() {
  const { postId } = useParams();
  const [showPreview, setShowPreview] = React.useState(false);
  const [newVal, setNewVal] = React.useState({
    title: "",
    content: "",
  });
  const history = useHistory();

  const [updatePost] = useMutation(EDIT_POST);

  const client = useApolloClient();
  React.useEffect(() => {
    const fetchPost = async () => {
      const response = await client.query({
        query: FETCH_POST,
        variables: {
          postId: postId,
        },
      });
      setNewVal((prev) => ({
        ...prev,
        title: response?.data?.posts_by_pk?.media,
        content: response?.data?.posts_by_pk?.caption,
      }));
    };
    fetchPost();
  }, [client, postId]);

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  function handleTitle(e) {
    const { value } = e.target;
    setNewVal((prev) => ({
      ...prev,
      title: value,
    }));
  }

  function handleContent(e) {
    const { value } = e.target;
    setNewVal((prev) => ({
      ...prev,
      content: value,
    }));
  }

  function handleUpdatePost() {
    const variables = {
      postId: postId,
      title: newVal.title,
      content: newVal.content,
    };
    updatePost({ variables });
    history.push(`/p/${postId}`);
  }

  return (
    <div className="p-3">
      <textarea
        placeholder="Title…"
        className="w-full px-4 mt-2 mb-5 text-3xl font-bold leading-snug bg-transparent outline-none appearance-none resize-none text-brand-black dark:text-white placeholder-brand-grey-500"
        style={{ height: "82px !important" }}
        defaultValue={newVal.title}
        onChange={handleTitle}
      />
      <div className="relative z-30 p-2 border rounded bg-gray-300 dark:bg-brand-dark-grey-700 dark:border-brand-grey-800 toolbar-tabs ">
        <div className="flex flex-row flex-wrap justify-between pb-1">
          <div className="flex flex-row items-center text-sm text-gray-700 dark:text-gray-400">
            <button
              className="button-transparent small flex flex-row items-center active p-2"
              title="Write Markdown"
              onClick={() => setShowPreview(false)}
            >
              <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 512 512">
                <path d="M493.255 56.236l-37.49-37.49c-24.993-24.993-65.515-24.994-90.51 0L12.838 371.162.151 485.346c-1.698 15.286 11.22 28.203 26.504 26.504l114.184-12.687 352.417-352.417c24.992-24.994 24.992-65.517-.001-90.51zm-95.196 140.45L174 420.745V386h-48v-48H91.255l224.059-224.059 82.745 82.745zM126.147 468.598l-58.995 6.555-30.305-30.305 6.555-58.995L63.255 366H98v48h48v34.745l-19.853 19.853zm344.48-344.48l-49.941 49.941-82.745-82.745 49.941-49.941c12.505-12.505 32.748-12.507 45.255 0l37.49 37.49c12.506 12.506 12.507 32.747 0 45.255z"></path>
              </svg>
              <span className="font-medium">Write</span>
            </button>
            <button
              className="button-transparent small flex flex-row items-center "
              title="Preview Markdown"
              onClick={() => setShowPreview((prev) => !prev)}
            >
              <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 576 512">
                <path d="M288 288a64 64 0 000-128c-1 0-1.88.24-2.85.29a47.5 47.5 0 01-60.86 60.86c0 1-.29 1.88-.29 2.85a64 64 0 0064 64zm284.52-46.6C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 000 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 000-29.19zM288 96a128 128 0 11-128 128A128.14 128.14 0 01288 96zm0 320c-107.36 0-205.46-61.31-256-160a294.78 294.78 0 01129.78-129.33C140.91 153.69 128 187.17 128 224a160 160 0 00320 0c0-36.83-12.91-70.31-33.78-97.33A294.78 294.78 0 01544 256c-50.53 98.69-148.64 160-256 160z"></path>
              </svg>
              <span>Preview</span>
            </button>
            <button
              className="button-transparent small flex flex-row items-center p-2"
              title="Add Image"
              onClick={() => setShowPreview((prev) => !prev)}
            >
              <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 512 512">
                <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.822-7.178 16-16 16H48c-8.822 0-16-7.178-16-16V112c0-8.822 7.178-16 16-16h416c8.822 0 16 7.178 16 16v288zM112 232c30.928 0 56-25.072 56-56s-25.072-56-56-56-56 25.072-56 56 25.072 56 56 56zm0-80c13.234 0 24 10.766 24 24s-10.766 24-24 24-24-10.766-24-24 10.766-24 24-24zm207.029 23.029L224 270.059l-31.029-31.029c-9.373-9.373-24.569-9.373-33.941 0l-88 88A23.998 23.998 0 0064 344v28c0 6.627 5.373 12 12 12h360c6.627 0 12-5.373 12-12v-92c0-6.365-2.529-12.47-7.029-16.971l-88-88c-9.373-9.372-24.569-9.372-33.942 0zM416 352H96v-4.686l80-80 48 48 112-112 80 80V352z"></path>
              </svg>
              <span>Add Image</span>
            </button>
          </div>
          <button
            className="flex flex-row items-center border-2 rounded p-1 border-black"
            onClick={handleUpdatePost}
          >
            <svg
              className="w-5 h-5 mr-2 opacity-75 fill-current"
              viewBox="0 0 512 512"
            >
              <path d="M464 4.3L16 262.7C-7 276-4.7 309.9 19.8 320L160 378v102c0 30.2 37.8 43.3 56.7 20.3l60.7-73.8 126.4 52.2c19.1 7.9 40.7-4.2 43.8-24.7l64-417.1C515.7 10.2 487-9 464 4.3zM192 480v-88.8l54.5 22.5L192 480zm224-30.9l-206.2-85.2 199.5-235.8c4.8-5.6-2.9-13.2-8.5-8.4L145.5 337.3 32 290.5 480 32l-64 417.1z"></path>
            </svg>
            <span>Publish</span>
          </button>
        </div>
      </div>
      {!showPreview && (
        <textarea
          name="editor"
          placeholder="Tell your story…"
          className="w-full resize-none p-4 bg-transparent text-brand-black dark:text-white focus:outline-none text-xl leading-snug placeholder-brand-grey-500 py-12 min-h-screen"
          // style="height: 150px !important;"
          style={{ height: "150px !important" }}
          defaultValue={newVal.content}
          onChange={handleContent}
        />
      )}
      {showPreview && (
        <ReactMarkdown
          source={newVal.content}
          escapeHtml={false}
          className="prose w-full resize-none p-4 bg-transparent text-brand-black dark:text-white focus:outline-none text-xl leading-snug placeholder-brand-grey-500 py-12 min-h-screen"
          renderers={renderers}
          plugins={[gfm]}
          onChange={(e) => console.log("yup")}
          children={newVal.content}
        />
      )}
    </div>
  );
}

export default UpdatePost;
