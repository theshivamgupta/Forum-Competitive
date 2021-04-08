import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/shared/Layout";
import Post from "../components/post/Post";

function PostPage() {
  const { postId } = useParams();

  return (
    <Layout>
      <Post postId={postId} />
      {/* <MorePostsFromUser postId={postId} /> */}
    </Layout>
  );
}

export default PostPage;
