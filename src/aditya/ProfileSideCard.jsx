import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  sidecard: {
    width: '90%',
    padding: '5%'
  },
  frienddata: {
      width: '100%'
  },
  data: {
      display: 'flex',
      alignItems: 'center'
  },
  friends: {
      display: "inline-block",
      fontFamily: 'Trebuchet MS',
      fontWeight: '700'
  },
  number: {
    display: "inline-block",
    fontFamily: 'Trebuchet MS',
    fontWeight: '700',
    fontSize: '120%',
    color: '#4267B2'
  },
}));

export default function ProfileSideCard() {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.sidecard} elevation={3}>
          <Grid className={classes.frienddata} container spacing={1}>
              <Grid className={classes.data} item xs={3}>
                  <Typography className={classes.friends}>Followers</Typography>
              </Grid>
              <Grid className={classes.data} item xs={3}>
                  <Typography className={classes.number}>20</Typography>
              </Grid>
              <Grid className={classes.data} item xs={3}>
                  <Typography className={classes.friends}>Following</Typography>
              </Grid>
              <Grid className={classes.data} item xs={3}>
                  <Typography className={classes.number}>17</Typography>
              </Grid>
          </Grid>
      </Paper>
    </div>
  );
}