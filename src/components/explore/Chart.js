import React from "react";
import { color } from "../../utils/color";
import CloseIcon from "@material-ui/icons/Close";
import { fetchUserData } from "../../utils/api/CodeForces";
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
      <Line
        data={{
          labels: points.map((user) => `${user?.contestId}`),
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

const Chart = React.forwardRef(({ handleDetail, handleClose }, ref) => {
  const [res, setRes] = React.useState([]);
  const { handle, rating } = handleDetail;

  React.useEffect(() => {
    const fetchAPI = async () => {
      setRes(await fetchUserData(handleDetail?.handle));
    };
    fetchAPI();
  }, [handleDetail]);

  return (
    <main className="bg-white p-5" style={{ width: "70vw" }}>
      <div className="flex justify-between overflow-hidden">
        <div>
          <div style={{ color: `${color(rating)}`, fontWeight: "700" }}>
            {handle}
          </div>
          <div className="underline">
            <a
              href={`https://codeforces.com/profile/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Profile
            </a>
          </div>
        </div>
        <CloseIcon onClick={handleClose} />
      </div>
      <div className="w-full">{res && <LineChart res={res} />}</div>
    </main>
  );
});

export default Chart;
