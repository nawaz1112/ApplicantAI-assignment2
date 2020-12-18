// This is the reducer for all of the components in the application.

import { combineReducers } from 'redux'
import { ADD_TO_CART, REMOVE_CART_ITEM, UPDATE_QUANTITY, RESET_SHOP} from './../actions'

// This holds the inventory and the initial states of the cart and the total price. 
// In production, this would come from an AJAX call.

let initialState = { 
    inventory: [
        {
            id: 1,
            name: "Dal",
            pictureURL: "/images/dal.jpg",
            price: 120
        },
        {
            id: 2,
            name: "Atta",
            pictureURL: "/images/aashirvaad-whole-wheat-atta.jpg",
            price: 320
        },
        {
            id: 3,
            name: "Chana",
            pictureURL: "/images/chana.jpg",
            price: 100
        },
        {
            id: 4,
            name: "Dry fruits",
            pictureURL: "/images/dry-fruits.jpg",
            price: 700
        },
        {
            id: 5,
            name: "Marie gold",
            pictureURL: "/images/biscuit-main.jpg",
            price: 10
        },
        {
            id: 6,
            name: "Oreo",
            pictureURL: "/images/oreo.jpg",
            price: 20
        },
        {
            id: 7,
            name: "Parachute oil",
            pictureURL: "/images/oil.png",
            price: 60
        },
        {
            id: 8,
            name: "Head & Shoulder",
            pictureURL: "/images/headShoulder.jpg",
            price: 30
        },
        {
            id: 9,
            name: "Rin Soap bar",
            pictureURL: "/images/rin-soap.png",
            price: 60
        }
    ],
    cart: [],
    totalPrice: 0
}

const calculateTotalPrice = (cart) => {
    let totalPrice = 0
    totalPrice = cart.reduce((totalPrice, cartItem) => totalPrice + cartItem.price, 0)
    return totalPrice
}

// This would be called whenever delete button is clicked or when a user sets an item's quantity to none or 0.
const removeCartItem = (state, index) => {
    let cart = [
        ...state.cart.slice(0, index),
        ...state.cart.slice(index + 1)
    ]
    let totalPrice = calculateTotalPrice(cart)
    return {
        ...state,
        cart,
        totalPrice
    }
}

// This would update the quantity or call removeCartItem if quantity set is less than 1.
const updateQuantity = (state, item, quantity, index) => {
    let cart = [...state.cart]
    if (typeof quantity != 'undefined' && quantity > 0) {
        item.quantity = quantity
        item.price = item.quantity * item.unitPrice
        cart[index] = item
        let totalPrice = calculateTotalPrice(cart)
        return {
            ...state,
            cart,
            totalPrice
        }
    } else {
        return removeCartItem(state, index)
    }
}

const addToCart = (state, item) => {

    var foundItems = state.cart.filter(function (cartItem) {
        return cartItem.id === item.id;
    });

    if (foundItems.length > 0) {
        let newQuantity = Number(foundItems[0].quantity) + 1;
        return updateQuantity(state, foundItems[0], newQuantity)
    } else {
        const newItem = {
            id: item.id,
            quantity: 1,
            price: item.price,
            unitPrice: item.price,
            name: item.name
        };
    
        let cart = [...state.cart, newItem]
        let totalPrice = calculateTotalPrice(cart)
    
        return {
            ...state,
            cart,
            totalPrice
        }
    }
    
}


const shopReducer = (state=initialState, action) => {
  let cart;
  let totalPrice;  
  switch (action.type) {
    case ADD_TO_CART:
        return addToCart(state, action.item, -1)
    case REMOVE_CART_ITEM:
        return removeCartItem(state, action.index)
    case UPDATE_QUANTITY:
        cart = [...state.cart]
        return updateQuantity(state, cart[action.index], action.quantity, action.index)
    case RESET_SHOP:
        console.log("INSIDE RESET SHOP")
        return initialState
    default:
      return state    
  }  
}

const combinedReducer = combineReducers({
  shop: shopReducer
})

export default combinedReducer
