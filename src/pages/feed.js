import React from "react";

import Layout from "../components/shared/Layout";
// import FeedPost from "../components/feed/FeedPost";
// import { getDefaultPost } from "../data";
import LoadingScreen from "../components/shared/LoadingScreen";
// import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/client";
import { GET_FEED_ALL } from "../graphql/queries";
import usePageBottom from "../utils/usePageBottom";
import "../assets/test.css";
// import { LoadingLargeIcon } from "../icons";
const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const { feedIds } = React.useContext(UserContext);
  const [isEndOfFeed, setEndOfFeed] = React.useState(false);
  const [active, setActiveTab] = React.useState({
    interview: true,
    cp: false,
    blog: false,
  });
  // const variables = { feedIds, limit: 2 };
  const variables = {};
  const { data, loading, fetchMore } = useQuery(GET_FEED_ALL, { variables });
  // console.log({ data });
  const isPageBottom = usePageBottom();

  const handleUpdateQuery = React.useCallback((prev, { fetchMoreResult }) => {
    console.log({ prev, fetchMoreResult });
    if (fetchMoreResult.posts.length === 0) {
      setEndOfFeed(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }, []);

  React.useEffect(() => {
    if (!isPageBottom || !data || isEndOfFeed) return;
    // const variables = { limit: 2, feedIds, lastTimestamp };
    const variables = {};
    fetchMore({
      variables,
      updateQuery: handleUpdateQuery,
    });
  }, [isPageBottom, data, fetchMore, handleUpdateQuery, feedIds, isEndOfFeed]);

  // let loading = false;
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div>
        <div className="button-container">
          <div
            className={`button ${active.interview ? "onClick" : ""}`}
            onClick={() => {
              setActiveTab((prev) => ({
                ...prev,
                interview: true,
                cp: false,
                blog: false,
              }));
            }}
          >
            <button className="btn-slide-line">
              <span className="type-post">Interview Prep</span>
            </button>
          </div>
          <div
            className={`button ${active.cp ? "onClick" : ""}`}
            onClick={() => {
              setActiveTab((prev) => ({
                ...prev,
                interview: false,
                cp: true,
                blog: false,
              }));
            }}
          >
            <button className="btn-slide-line">
              <span className="type-post">Competitive Programming</span>
            </button>
          </div>
          <div
            className={`button ${active.blog ? "onClick" : ""}`}
            onClick={() => {
              setActiveTab((prev) => ({
                ...prev,
                interview: false,
                cp: false,
                blog: true,
              }));
            }}
          >
            <button className="btn-slide-line">
              <span className="type-post">Blog</span>
            </button>
          </div>
        </div>
        <div>
          {data?.posts.map((post, index) => (
            <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost index={index} post={post} />
            </React.Suspense>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default FeedPage;
