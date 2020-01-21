import React from 'react';
import classes from './MenuBtn.css';

const menuBtn = (props) => (
    <button className={classes.MenuBtn} onClick={props.clicked}>Menu</button>
);


export default menuBtn;
