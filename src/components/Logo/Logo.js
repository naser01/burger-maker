import React from 'react';
import classes from './Logo.css';
import burgerLogo from "../../assests/Images/burger-logo.png"

const logo = (props) => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="Burger"/>
    </div>
);

export default logo;