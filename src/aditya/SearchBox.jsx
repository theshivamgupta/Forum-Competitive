import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    searchDiv:{
        width: '100%',
        display: 'flex',
        marginBottom: '10px',
        alignItems: 'center',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'            
        }
    },
    textfield: {
        width: '330px',
        [theme.breakpoints.down('sm')]: {
            width: '300px'            
        }
    },
    searchlabel: {
        fontFamily: 'Trebuchet MS',
    },
    
}));

export default function StackCard() {
  const classes = useStyles();

  return (
    <div className={classes.searchDiv}>
        <TextField 
        className={classes.textfield} 
        label="Search for User" 
        variant="outlined" 
        size="small"
        InputProps={{
            className: classes.searchlabel
        }}
        InputLabelProps={{
            className: classes.searchlabel
        }}></TextField>      
    </div>
  );
}
