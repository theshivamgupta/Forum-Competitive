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
  stackitem: {
    width: '100%',
    height: '100px',
    margin: 'auto',
    marginBottom: '20px',
    transition: '0.4s',
    [theme.breakpoints.up('md')]: {
      height: '120px',
    },
    '&:hover':{
      backgroundColor: "#f5f5f5"
    }
  },
  maingrid: {
    height: '100%'
  },
  divider: {
    height: '80px',
    alignSelf: 'center'
  },
  usericon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    transition: '0.15s',
    cursor: 'pointer',
    '&:hover':{
      color: '#F23A3A'
    }
  },
  avatar: {
    height: '43px',
    width: '43px',
    [theme.breakpoints.up('md')]: {
      height: '50px',
      width: '50px',
    }
  },
  user: {
    fontFamily: 'Verdana',
    marginTop: '3%',
    fontWeight: '700'
  },
  post: {
    display: 'flex',
    justifyContent: 'space-between',
    transition: '0.15s',
    '&:hover':{
      color: '#F23A3A'
    }
  },
  mainpost: {
    display: 'flex',
    width: '90%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  content: {
    fontFamily: 'Trebuchet MS',
    fontWeight: '700',
    fontSize: '115%',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      fontSize: '130%'
    }
  },
  timestamp: {
    fontFamily: 'Lucida Console',
    fontSize: '80%',
    color: '#7e7e7e',
    [theme.breakpoints.up('md')]: {
      fontSize: '90%'
    }
  },
  likes: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  likeicon: {
    color: '#F23A3A',
    height: '30px',
    width: '30px'
  },
  likecount: {
    fontWeight: '700',
    fontFamily: 'Lucida Console',
    fontSize: '85%'
  }
}));

export default function StackCard() {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.stackitem} elevation={1}>
        <Grid className={classes.maingrid} container spacing={2}>
          <Grid className={classes.usericon} item xs={3} sm={2}>
            <Avatar className={classes.avatar} alt="Remy Sharp" src="https://thispersondoesnotexist.com/image" />
            <Hidden smDown>
              <Typography className={classes.user} variant='caption'>Remy Sharp</Typography>
            </Hidden>
          </Grid>
          <Grid className={classes.post} item xs={9} sm={8}>
            <Divider className={classes.divider} orientation="vertical" flexItem light/>
            <div className={classes.mainpost}>
              <Typography className={classes.content}>Hi There</Typography>
              <Typography className={classes.timestamp}>Posted 2 hours ago</Typography>
            </div>
            <Hidden smDown>
              <Divider className={classes.divider} orientation="vertical" flexItem light/>
            </Hidden>
          </Grid>
          <Hidden smDown>
            <Grid className={classes.likes} item sm={2}>
              <FavoriteIcon className={classes.likeicon}></FavoriteIcon>
              <Typography className={classes.likecount}>23</Typography>
            </Grid>
          </Hidden>
          
        </Grid>
      </Paper>
    </div>
  );
}
