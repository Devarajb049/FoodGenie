//store cart items
//track restaurant info
//handleloading errors
//update cart when user adds/remove items
//store delivery details

import { createSlice } from "@reduxjs/toolkit"

//Initial 

const storedCartItems = typeof window !== "undefined" && localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const storedRestaurant = typeof window !== "undefined" && localStorage.getItem("cartRestaurant")
  ? JSON.parse(localStorage.getItem("cartRestaurant"))
  : {};

const initialState = {
    cartItems: storedCartItems,
    restaurant: storedRestaurant,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartRequest: (state) => {
            state.loading = true;
        },
        cartSuccess: (state, action) => {
            state.loading = false;
            state.cartItems = action.payload.items || [];
            state.restaurant = action.payload.restaurant || {};
            localStorage.setItem("cartItems", JSON.stringify(action.payload.items || []));
            localStorage.setItem("cartRestaurant", JSON.stringify(action.payload.restaurant || {}));
        },
        cartFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateCartSuccess: (state, action) => {
            const items = action.payload.items || [];
            state.cartItems = items;
            localStorage.setItem("cartItems", JSON.stringify(items));
        },
        removeCartSuccess: (state, action) => {
            const items = action.payload?.cart?.items || [];
            state.cartItems = items;
            localStorage.setItem("cartItems", JSON.stringify(items));
            if (items.length === 0) {
                state.restaurant = {};
                localStorage.removeItem("cartRestaurant");
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.restaurant = {};
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cartRestaurant");
        },
        clearErrors: (state) => {
            state.error = null;
        },
        saveDeliveryInfo: (state, action) => {
            state.deliveryInfo = action.payload;
        }
    }
})

export const {
    cartRequest,
    cartSuccess,
    cartFail,
    updateCartSuccess,
    removeCartSuccess,
    clearCart,
    clearErrors,
    saveDeliveryInfo
} = cartSlice.actions;

export default cartSlice.reducer