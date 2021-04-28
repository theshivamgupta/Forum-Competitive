import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
    covercard : {
        height: '450px',
        width: '100%',
        margin: 'auto',
        marginBottom: '2%'
    },  
    cover: {
        height: '100%'
    },
    coverimg : {
        height: '55%',
        background: "url('https://img5.goodfon.com/wallpaper/nbig/7/64/abstract-background-rounded-shapes-colorful-abstraktsiia-tek.jpg') no-repeat center center",
        backgroundSize: 'cover'
    },
    profile: {
        height: '35%'
    },
    profilepic: {
        display: 'flex',
        justifyContent:'flex-end',
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            justifyContent:'center',            
        }
    },
    profileimg: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '150px',
        height: '150px',
        top: '-65px',
        border: '5px solid #ededed',
        [theme.breakpoints.down('md')]: {
            width: '120px',
            height: '120px',
            top: '-60px',
        }
    },
    profileinfo: {
        width: '96%',
        padding: '2%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    name: {
        fontFamily: 'Trebuchet MS',
        fontWeight: '700',
        width: '100%',
        fontSize: '200%',
        height: '30px',
        [theme.breakpoints.down('md')]: {
            fontSize: '170%'
        }
    },
    username: {
        display: 'inline-block',
        fontFamily: 'Trebuchet MS',
        fontWeight: '700',
        fontSize: '120%',
        color: '#4267B2',
        [theme.breakpoints.down('md')]: {
            fontSize: '110%'
        }
    },
    codeforces: {
        display: 'inline-block',
        fontFamily: 'Trebuchet MS',
        fontWeight: '400',
        fontSize: '120%',
        color: '#8d8d8d',
        [theme.breakpoints.down('md')]: {
            fontSize: '110%'
        }
    },
    bio: {
        fontFamily: 'Trebuchet MS',
        fontWeight: '400',
        fontSize: '120%',
        color: '#747474',
        [theme.breakpoints.down('md')]: {
            fontSize: '100%'
        }
    },
    coverButtons: {
        display: 'flex',
        padding: '2%',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    editprofile: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    },
    settings: {
        height: 'inherit',
        width: '30px',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
            transform: 'rotate(360deg) scale(1.1)'
        }
    },
    navigation: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    navtab: {
        fontFamily: 'Trebuchet MS',
        [theme.breakpoints.down('md')]: {
            fontSize: '100%'
        }
    },
}));

export default function ProfileMainCard() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
        <Paper className={classes.covercard}>
            <Grid className={classes.cover} container>
                <Grid className={classes.coverimg} item xs={12}></Grid>
                <Grid className={classes.profile} item xs={12}>
                    <Grid style={{height: '100%', width: '100%'}} container>
                        <Grid className={classes.profilepic} item xs={4} md={3}>
                            <Avatar className={classes.profileimg} alt="John Doe" src="https://thispersondoesnotexist.com/image"></Avatar>
                        </Grid>
                        <Grid className={classes.profileinfo} item xs={7} md={6}>
                            <Grid container style={{width: '100%', height: '100%'}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.name}>John Doe</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.username}>@johndoe</Typography>         
                                    <Typography className={classes.codeforces}>(@johndoe)</Typography>                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.bio}>Going Anonymous</Typography>                               
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={classes.coverButtons} item xs={1} md={3}>
                            <div className={classes.editprofile}>
                                <Hidden smDown>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<EditOutlinedIcon/>}
                                    >
                                        Edit Profile
                                    </Button>
                                </Hidden>
                                <svg aria-label="Options" className={classes.settings} fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z" fill-rule="evenodd"></path></svg>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className={classes.navigation} xs={12}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab className={classes.navtab} label="Profile" />
                        <Tab className={classes.navtab} label="Followers" />
                        <Tab className={classes.navtab} label="Following" />
                    </Tabs>
                </Grid>
            </Grid>            
        </Paper>
    </div>
  );
}