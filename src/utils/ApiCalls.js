import axios from 'axios';
import { API_URL_LOCAL, API_URL_PROD } from './constants';
import { getToken } from './TokenService.js';

export const getApiUrl = () => {
	// eslint-disable-next-line no-undef
	if (process.env.NODE_ENV === 'development') {
		return API_URL_LOCAL;
	} else {
		return API_URL_PROD;
	}
};

// login the user
export const login = (token) => {
	saveToken(token);
};

// logout the user
export const logout = () => {
	localStorage.removeItem('token');
};

// signup the user
export const signup = (username, password, email) => {
	const response = axios.post(getApiUrl() + '/api/signup', {
		username: username,
		password: password,
		email: email,
	});
	if (response.status === 200) {
		//get the token
		const token = getToken(username, password);
		login(token);
	}
};

export const saveToken = (token) => {
	if (token) {
		localStorage.setItem('token', JSON.stringify(token));
	}
};

export const getTokenFromStorage = () => {
	const token = localStorage.getItem('token');
	if (token) {
		return JSON.parse(token).access;
	}
	return null;
};

export const getRefreshTokenFromStorage = () => {
	const token = localStorage.getItem('token');
	if (token) {
		return JSON.parse(token).refresh;
	}
	return null;
};

export const removeTokenFromStorage = () => {
	localStorage.removeItem('token');
};
