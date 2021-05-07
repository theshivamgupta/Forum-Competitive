import React from "react";
import { usePostSkeletonStyles } from "../../styles";
import { useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export function PostSkeleton() {
  const classes = usePostSkeletonStyles();
  const matches = useMediaQuery("(min-width: 900px)");

  return (
    <div
      className={classes.container}
      style={{
        gridTemplateColumns: matches && "600px 335px",
      }}
    >
      <div className="mx-auto">
        <Skeleton variant="rect" width={"70vw"} />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" width={"70vw"} height={"1000px"} />
      </div>
    </div>
  );
}

export default PostSkeleton;
