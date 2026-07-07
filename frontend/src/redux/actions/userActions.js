import api from "../../utils/api";
import {
    userRequest,
    userSuccess,
    userFail,
    logoutSuccess,
    logoutFail,
    updateRequest,
    updateSuccess,
    updateFail,
    updateReset,
    clearErrors as clearErrorsSlice,
} from "../slices/userSlice";

export const clearErrors = () => (dispatch) => {
    dispatch(clearErrorsSlice());
};

// LOGIN

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(userRequest());
        const { data } = await api.post("/v1/users/login", {
            email,
            password,
        });
        dispatch(userSuccess(data.data.user));
    } catch (error) {
        dispatch(userFail(error.response?.data?.message || "Login Failed"));
    }
};

//Register
export const register = (userData) => async (dispatch) => {
    try {
        dispatch(userRequest());

        const { data } = await api.post("/v1/users/signup", userData, {
            headers: { "Content-Type": "application/json" },
        });
        dispatch(userSuccess(data.data.user));
    } catch (error) {
        dispatch(userFail(error.response?.data?.message || "Registration Failed"));
    }
};

//load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(userRequest());

        const { data } = await api.get("/v1/users/me");

        console.log("loadUser response:", data);

        dispatch(userSuccess(data.user));
    } catch (error) {
        console.log("loadUser error:", error.response);

        dispatch(userFail(error.response?.data?.message || "Failed to load user"));
    }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateRequest());

        const { data } = await api.put("/v1/users/me/update", userData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(updateSuccess(data.success));
    } catch (error) {
        dispatch(updateFail(error.response?.data?.message));
    }
};

//logout
export const logout = () => async (dispatch) => {
    try {
        await api.get("v1/users/logout");
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail(error.response?.data?.message));
    }
};
