import React from "react";
import { fetchUserData } from "./utils/api/CodeForces";
import { Line } from "react-chartjs-2";

const LineChart = ({ res }) => {
  const [points, setPoints] = React.useState([]);

  const pushPoint = React.useCallback(() => {
    if (res) setPoints([]);
    if (res) setPoints(res);
  }, [res, setPoints]);

  React.useEffect(() => {
    pushPoint();
  }, [pushPoint]);

  React.useEffect(() => {
    console.log("rerender");
  }, [points]);

  return (
    <>
      <button onClick={() => console.log(points)}>See</button>
      <Line
        data={{
          labels: points.map((user) => `${user?.contestName}`),
          datasets: [
            {
              data: points.map(({ rating }) => rating),
              label: "Rating",
              borderColor: "#3333ff",
              fill: true,
            },
          ],
        }}
      />
    </>
  );
};

function Test() {
  const [value, setValue] = React.useState("");
  const [data, setData] = React.useState("");
  const [res, setRes] = React.useState();

  async function handleFetch(e) {
    e.preventDefault();
    const response = await fetchUserData(value);
    console.log("coming here again");
    setData(JSON.stringify(response, null, 2));
    setRes(response);
  }

  React.useEffect(() => {
    console.log("parent rerender");
  }, [res]);

  //`${user?.rating} (${user.changedRating})\n ${user?.rank}\n ${user?.contestName}`

  return (
    <>
      <input type="text" onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleFetch}>Submit</button>
      <button onClick={() => console.log(res)}>Click</button>
      <p>{data}</p>
      {res && <LineChart res={res} />}
    </>
  );
}

export default Test;
