import {getApiUrl} from "./ApiCalls";
import axios from "axios";
import { getTokenFromStorage, getRefreshTokenFromStorage,saveToken } from "./ApiCalls.js";

// const generatedSalt = bcrypt.genSaltSync(10);
export async function getToken(username, password) {
    //hash the password
    // password = bcrypt.hashSync(password, generatedSalt);
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

export async function register(username, password, email) {
    //hash the password
    // password = bcrypt.hashSync(password, generatedSalt);
    const url = `${getApiUrl()}/api/register/`;
    const data = {
        'username': username,
        'password': password,
        'email': email,
    };
    return axios.post(url, data).then((response) => {
        console.log(response);
        return response.data.username;
    })
        .catch((error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data.username[0]);
            return error.response.data.username[0];
        } else if (error.request) {
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
}


//update password
export async function updatePassword(newPassword) {
    //hash the password
    // password = bcrypt.hashSync(password, generatedSalt);
    // newPassword = bcrypt.hashSync(newPassword, generatedSalt);
    const url = `${getApiUrl()}/api/update-password/`;
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

    const data = {
        'password': newPassword,
    };
    //headers
    const config = {
        method: 'put',
        url: url,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
        },
        data : data
    };

    return axios(config).then((response) => {
        console.log(response);
        return response.status;
    }
    )
        .catch((error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data.username[0]);
            return error.response.status;
        } else if (error.request) {
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    
}

//update first name and last name and email
export async function updateProfile(firstName, lastName, email) {
    const url = `${getApiUrl()}/api/update-user/`;
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

    const data = {
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
    };
    //headers
    const config = {
        method: 'put',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
        },
        data: data
    };

    return axios(config).then((response) => {
        console.log(response);
        return response.status;
    }
    )
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data.username[0]);
                return error.response.status;
            } else if (error.request) {
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

}