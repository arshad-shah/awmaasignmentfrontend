import React, {useEffect, useState} from 'react';
import {Box, Button, Container} from '@mui/material';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import * as PropTypes from 'prop-types';
import { isTokenExpired } from '../utils/TokenService';
import { getTokenFromStorage, getRefreshTokenFromStorage,saveToken,getApiUrl } from '../utils/ApiCalls';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home({ handleLogout, isMobile }) {
	const navigate = useNavigate();
    const [token, setToken] = useState({});
    useEffect(() => {
        setToken(getTokenFromStorage());
		if (!token) {
			navigate('/login');
		}
		Promise.resolve().then(async () => {
            //check if the token is expired
            const isExpired = await isTokenExpired(token);
            //if the token is expired, get a new one
            if (isExpired) {
                const refreshToken = getRefreshTokenFromStorage();
                //send the refresh token to the server to get a new access token
                const response = await axios.post(`${getApiUrl()}/api/token/refresh/`, {
                    'refresh': refreshToken
								});
								//if the response code is not 200, redirect to login
								if (response.status !== 200) {
									navigate('/login');
								}
                //recreate the token
                const newToken = {
                    'access': response.data.access,
                    'refresh': refreshToken
                };

                //save the new token in local storage
                saveToken(newToken);
                //get the new token from local storage
                setToken(getTokenFromStorage())
            }
		});

	}, []);

	return (
		<>
			<Box
				display={'flex'}
				flexDirection={'column'}
				minHeight={'100vh'}
				justifyContent={'space-between'}
			>
				<Menu user={token}/>
				<Container maxWidth={'md'} sx={{ top: '50px', bottom: '50px' }}>
					welcome
					<h1>Advanced Web Mapping 2022</h1>
					<h2>Assignment 2</h2>
					<h3>Student ID: C19485866</h3>
					<h3>Course ID: TU856</h3>
					<h3>Course Name: Computer Science</h3>
					<Button variant="contained" onClick={handleLogout}>Logout</Button>
				</Container>
				<Footer isMobile={isMobile}/>
			</Box>
		</>

	);

}

Home.propTypes = {
	user: PropTypes.object,
	handleLogin: PropTypes.func,
	handleLogout: PropTypes.func,
};

export default Home;