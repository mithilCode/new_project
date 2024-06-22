import axios from "axios";

export const saveToken = (user_data) => {
  setAuthToken(user_data);
  localStorage.setItem(
    "UserPreferences",
    window.btoa(JSON.stringify(user_data))
  );
};
export const setAuthToken = (access_Token) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ` + access_Token;
  } catch (e) {
    console.error("Error while setup token", e);
  }
};

export const getAuthToken = () => {
  let userPreferences = localStorage.getItem("UserPreferences");
  if (userPreferences) {
    try {
      const decodedPreferences = JSON.parse(window.atob(userPreferences));
      return decodedPreferences;
    } catch (error) {
      console.error("Error parsing user preferences:", error);
    }
  }
};

export const clearToken = () => {
  localStorage.removeItem("UserPreferences");
  clearAuthToken();
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
};
