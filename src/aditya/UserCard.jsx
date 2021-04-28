import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  usercard: {
      width: '100%',
      height: '280px',
      margin: 'auto',
      [theme.breakpoints.down('md')]: {
        width: '70%'            
      }
  },
  container: {
      width: '100%',
      height: '100%'
  },
  coverimg: {
    height: '40%',
    background: "url('https://img5.goodfon.com/wallpaper/nbig/7/64/abstract-background-rounded-shapes-colorful-abstraktsiia-tek.jpg') no-repeat center center",
    backgroundSize: 'cover',
    borderRadius: '5px'
  },
  userinfo: {
    height: '40%',
  },
  profilepic: {
    width: '100%',
    height: '50%',
    display: 'flex',
    justifyContent: 'center'
  },
    profileimg: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '85px',
        height: '85px',
        top: '-45px',
        border: '5px solid #ededed',
    },
    profileinfo: {
        height: '50%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    name: {
        fontFamily: 'Trebuchet MS',
        fontWeight: '700',
        fontSize: '110%',
        color: '#4267B2'
    },
    username: {
        fontFamily: 'Trebuchet MS',
        fontWeight: '700',
        fontSize: '100%',
        cursor: 'pointer',
        color: '#f50057'
    },
    cardbuttons: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '20%'
    },
}));

export default function UserCard() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper className={classes.usercard} elevation={3}>
          <Grid className={classes.container} container>
              <Grid className={classes.coverimg} item xs={12}></Grid>
              <Grid className={classes.userinfo} item xs={12}>
                  <Grid className={classes.container} container>
                      <Grid className={classes.profilepic} item xs={12}>
                        <Avatar className={classes.profileimg} alt="John Doe" src="https://thispersondoesnotexist.com/image"></Avatar>
                      </Grid>
                      <Grid className={classes.profileinfo} item xs={12}>
                          <Typography className={classes.name}>John Doe</Typography>
                          <Typography className={classes.username}>@johndoe</Typography>
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
