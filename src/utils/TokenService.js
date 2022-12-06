import {getApiUrl} from "./ApiCalls";
import axios from "axios";


export async function getToken(username, password) {
    try{
        const url = `${getApiUrl()}/api/token/`;
        const data = {
            'username': username,
            'password': password,
        };
        const response = await axios.post(url, data);
        return response.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function isTokenExpired(token) {
    try{
        const url = `${getApiUrl()}/api/token/verify/`;
        const data = {
            'token' : token,
        };
        const response = await axios.post(url, data);
        return response.status === 401;
    } catch (e) {
        console.log(e);
        return true;
    }
}