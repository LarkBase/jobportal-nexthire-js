import Cookies from "js-cookie";
import axios from "axios";
import { API_ENDPOINTS } from "@/config";

export const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });

    if (response.data.success) {
      // Store the new access token in cookies
      Cookies.set("accessToken", response.data.accessToken, { expires: 15 / (24 * 60) }); // 15 minutes
      return response.data.accessToken;
    } else {
      throw new Error("Failed to refresh access token");
    }
  } catch (err) {
    console.error("Error refreshing access token:", err);
    // Clear tokens and redirect to login page
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login"; // Redirect to login page
    return null;
  }
};