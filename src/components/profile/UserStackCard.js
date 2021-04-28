import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useFriendsStyles } from "../../styles";

export default function UserStackCard({ friend }) {
  const classes = useFriendsStyles();
  //   console.log(friend);
  return (
    <div>
      <Paper className={classes.usercard} elevation={3}>
        <Grid className={classes.container} container>
          <Grid className={classes.coverimg} item xs={12}></Grid>
          <Grid className={classes.userinfo} item xs={12}>
            <Grid className={classes.container} container>
              <Grid className={classes.profilepic} item xs={12}>
                <Avatar
                  className={classes.profileimg}
                  alt="John Doe"
                  src={friend?.user?.profile_image}
                ></Avatar>
              </Grid>
              <Grid className={classes.profileinfo} item xs={12}>
                <Typography className={classes.name}>
                  {friend?.user?.name}
                </Typography>
                <Typography className={classes.username}>
                  @{friend?.user?.username}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.cardbuttons} item xs={12}>
            <Button>View</Button>
            <Button>Remove</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}