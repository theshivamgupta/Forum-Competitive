import React from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import UserCard from "../components/shared/UserCard";
// import FeedPost from "../components/feed/FeedPost";
// import { getDefaultPost } from "../data";
import LoadingScreen from "../components/shared/LoadingScreen";
// import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/client";
import { GET_FEED_ALL } from "../graphql/queries";
import usePageBottom from "../utils/usePageBottom";
// import { LoadingLargeIcon } from "../icons";
const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const classes = useFeedPageStyles();
  const { me, feedIds } = React.useContext(UserContext);
  const [isEndOfFeed, setEndOfFeed] = React.useState(false);
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
    if (!isPageBottom || !data) return;
    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    // const variables = { limit: 2, feedIds, lastTimestamp };
    const variables = {};
    fetchMore({
      variables,
      updateQuery: handleUpdateQuery,
    });
  }, [isPageBottom, data, fetchMore, handleUpdateQuery, feedIds]);

  // let loading = false;
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className={classes.container}>
        {/* Feed Posts */}
        <div>
          {data?.posts.map((post, index) => (
            <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost index={index} post={post} />
            </React.Suspense>
          ))}
        </div>
        {/* Sidebar */}
        {/* <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard user={me} avatarSize={50} />
              <FeedSideSuggestions />
            </div>
          </div>
        </Hidden> */}
      </div>
    </Layout>
  );
}

export default FeedPage;
