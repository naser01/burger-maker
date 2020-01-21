import React from 'react';
import Aux from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{textTransform: 'capitalize'}}>{igKey}</span>:{props.ingredients[igKey]}
                </li>);
        })

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>Burger with following ingredients:</p>
            <ul>
                {ingredientSummary}      
            </ul>
            <p><strong>Total Price: ${props.price}</strong></p>
            <p>Check Out?</p>
            <Button btnType={'Danger'} 
                    clicked={props.purchaseCanceled}>
                    <p>CANCEL</p></Button>
            <Button btnType={'Success'} 
                    clicked={props.purchaseContinued}>
                    <p>CONTINUE</p></Button>
        </Aux>
    );
};

export default orderSummary;