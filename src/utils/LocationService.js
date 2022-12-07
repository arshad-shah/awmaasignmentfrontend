import axios from "axios";
import { getApiUrl } from "./ApiCalls";
import { getTokenFromStorage, getRefreshTokenFromStorage,saveToken } from "./ApiCalls.js";
import { isTokenExpired } from "./TokenService.js";

export async function updateLocation(location) {
  try {
    const url = `${getApiUrl()}/api/update-location/`;
    //get the token from local storage
    let token = getTokenFromStorage();
    //check if the token is expired
    const isExpired = await isTokenExpired(token);
    //if the token is expired, get a new one
    if (isExpired) {
      const refreshToken = getRefreshTokenFromStorage();
      //send the refresh token to the server to get a new access token
      const response = await axios.post(`${getApiUrl()}/api/token/refresh/`, {
        'refresh': refreshToken
      });
      //recreate the token
      const newToken = {
        'access': response.data.access,
        'refresh': refreshToken
      };

      //save the new token in local storage
      saveToken(newToken);
      //get the new token from local storage
      token = getTokenFromStorage();
    }

    //headers
    const config = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      data : location
    };

    const response = await axios(config);
    return response.data;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}

export async function getMosques(bounds) {
  try {
    const url = 'https://overpass-api.de/api/interpreter?';
    const data = '[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](' + bounds._southWest.lat + ',' + bounds._southWest.lng + ',' + bounds._northEast.lat + ',' + bounds._northEast.lng + ');way["amenity"="place_of_worship"]["religion"="muslim"](' + bounds._southWest.lat + ',' + bounds._southWest.lng + ',' + bounds._northEast.lat + ',' + bounds._northEast.lng + ');relation["amenity"="place_of_worship"]["religion"="muslim"](' + bounds._southWest.lat + ',' + bounds._southWest.lng + ',' + bounds._northEast.lat + ',' + bounds._northEast.lng + '););out body;>;out skel qt;';
    const response = await axios.post(url, data);
    return response.data;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}