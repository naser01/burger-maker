import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from '../../components/UI/Spinner/Spinner.css';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.4,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        purchasable: false,
        purchasing: false,
        loading: false,
        totalPrice: 4,
        error: false
        
    }

    componentDidMount() {
        axios.get('https://react-my-project-d9465.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            })
        };   
    

    updatePuchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el
            },0)

        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount; 
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })

        this.updatePuchaseState(updatedIngredients)
    }


    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount; 
        const priceRemoved = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceRemoved;
        
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })   
        this.updatePuchaseState(updatedIngredients)
    };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Naser',
                address: {
                    street: 'teststreet',
                    zipCode: '324235',
                    country: 'Jordan'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'Fast'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false})
            });
            
    };

    render() {
        const disabledInfo = {...this.state.ingredients}
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients Can't be Loaded</p> : <Spinner/>;
                      
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        purchasable={this.state.purchasable}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}/>;
        }
        if(this.state.loading){
            orderSummary = <Spinner/>;
        } 
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}


export default withErrorHandler(BurgerBuilder, axios);
