import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ProfileMainCard from '../components/ProfileMainCard.jsx';
import ProfileSideCard from '../components/ProfileSideCard.jsx';
import StackCard from '../components/StackCard.jsx';

const useStyles = makeStyles((theme) => ({
  
}));

export default function Profile() {
  const classes = useStyles();

  return (
    <Container>
        <ProfileMainCard />     
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ProfileSideCard />
          </Grid>
          <Grid item xs={12} md={8}>
            <StackCard/>
            <StackCard/>
            <StackCard/>
            <StackCard/>
            <StackCard/>
            <StackCard/>
          </Grid>
        </Grid> 
    </Container>
  );
}
