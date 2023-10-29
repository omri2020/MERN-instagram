import API from "./index";

export const authCheck = async () => {
  try {
    const res = await API.get("/users/auth-check");
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signup = async (formData) => {
  try {
    const res = await API.post("/users/signup", formData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (formData) => {
  try {
    const res = await API.post("/users/login", formData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    await API.get("/users/logout");
    console.log("User Logged out successfully");
  } catch (error) {
    throw error.response.data;
  }
};
