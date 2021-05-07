import { Skeleton } from "@material-ui/lab";
import React from "react";

function Test() {
  return (
    <div className="w-full h-full">
      <div className="mx-auto">
        <Skeleton variant="rect" width={"70vw"} />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" width={"70vw"} height={"1000px"} />
      </div>
    </div>
  );
}

export default Test;
