import { useApolloClient, useQuery } from "@apollo/client";
import React from "react";
import TableComponent from "../components/explore/TableComponent";
import Layout from "../components/shared/Layout";
import LoadingScreen from "../components/shared/LoadingScreen";
import { GET_HANDLES } from "../graphql/queries";

function ExplorePage() {
  const [handles, setHandles] = React.useState([]);
  const { data, loading } = useQuery(GET_HANDLES);

  React.useEffect(() => {
    setHandles((result) => [...result, data?.users]);
    // console.log({ handles });
  }, [data]);

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className="grid justify-center">
        <TableComponent />
      </div>
    </Layout>
  );
}

export default ExplorePage;
