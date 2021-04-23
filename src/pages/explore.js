import { useApolloClient } from "@apollo/client";
import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { UserContext } from "../App";
import EnhancedTable from "../components/explore/TableComponent";
import Layout from "../components/shared/Layout";
// import LoadingScreen from "../components/shared/LoadingScreen";
import { GET_FRIENDS_HANDLE, GET_HANDLES } from "../graphql/queries";

function ExplorePage() {
  const [handles, setHandles] = React.useState([]);
  // const { data, loading } = useQuery(GET_HANDLES);
  const [isFollowOn, setFollowOn] = React.useState(false);
  const client = useApolloClient();
  const { currentUserId, me } = React.useContext(UserContext);
  // console.log({ me });
  React.useEffect(() => {
    setHandles([]);
    async function fetchUsers() {
      const { data } = await client.query({
        query: isFollowOn ? GET_FRIENDS_HANDLE : GET_HANDLES,
        variables: isFollowOn
          ? {
              userId: currentUserId,
            }
          : {},
      });
      let response = [];
      if (isFollowOn) {
        for (let i = 0; i < data?.followings.length; i++) {
          let id = data?.followings[i].id;
          let tempObj = {
            ...data?.followings[i].user,
            id,
          };
          response.push(tempObj);
        }
      } else {
        response = data?.users;
      }
      if (isFollowOn) {
        response.push({
          id: currentUserId,
          username: me?.username,
          profile_image: me?.profile_image,
          codeforces_rating: me?.codeforces_rating,
          codeforces_handle: me?.codeforces_handle,
        });
      }
      setHandles((result) => [...result, response]);
    }
    fetchUsers();
  }, [client, isFollowOn, currentUserId, me]);

  function handleChange(e) {
    e.preventDefault();
    setFollowOn((prev) => !prev);
  }

  return (
    <Layout>
      <div className="grid justify-center">
        <FormControlLabel
          control={
            <Switch
              checked={isFollowOn}
              onChange={handleChange}
              name="checkedA"
            />
          }
          label="Friends Only"
        />
        <EnhancedTable handles={handles.shift()} />
      </div>
    </Layout>
  );
}

export default ExplorePage;
