import { createSlice } from "@reduxjs/toolkit"

const storedUser = typeof window !== "undefined" && localStorage.getItem("user") 
  ? JSON.parse(localStorage.getItem("user")) 
  : null;

const initialState = {
    user: storedUser,
    loading: false,
    isAuthenticated: !!storedUser,
    error: null,
    isUpdated: false,
    message: null,
    success: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //login, register,load
        userRequest: (state) => {
            state.loading = true;
        },
        userSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload; //stores user data
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        userFail: (state, action) => {
            state.loading = false;
            // Only force logout if it's a 401 token authentication failure, not a transient network drop
            if (action.payload && action.payload.includes("not logged in")) {
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem("user");
            }
            state.error = action.payload;
        },

        //logout
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("user");
        },
        logoutFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //update profile/password
        updateRequest: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.loading = false,
                state.isUpdated = action.payload;
        },
        updateFail: (state, action) => {
            state.loading = false,
                state.error = action.payload;
        },
        updateReset: (state) => {
            state.isUpdated = false
        },

        clearErrors: (state) => {
            state.error = null
        }

    }
})



export const {
    userRequest, userSuccess,
    userFail, logoutFail, logoutSuccess, updateFail, updateRequest, updateSuccess, updateReset, clearErrors
} = userSlice.actions;

export default userSlice.reducer