import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
  Typography,
    Alert,
} from "@mui/material";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { isTokenExpired, updatePassword} from "../utils/TokenService";
import { getTokenFromStorage, getRefreshTokenFromStorage, saveToken, getApiUrl } from '../utils/ApiCalls';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



function ChangePassword({ isMobile, handleLogout }) {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handlePasswordChange = (event) => {
        setPassword( event.target.value);
    };
    const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
  }
  
      const handlePasswordStrength = () => {
        const weakPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
        const mediumPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[(){}\[\]<>])(?=.{8,})/;
        const veryStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[(){}\[\]<>])(?=.*[\-\_\=\+])(?=.{8,})/;

        let message = "Password strength:";
        let severity = "info";

        if(password.length === 0) return (<div></div>);

        //check the password strength by using regex
        if (password.match(veryStrongPassword)) {
            message += "Very Strong";
            severity = "success";
        } else if (password.match(strongPassword)) {
            message += "Strong";
            severity = "success";
        } else if (password.match(mediumPassword)) {
            message += "Medium";
            severity = "warning";
        } else if (password.match(weakPassword)) {
            message += "Weak";
            severity = "warning";
        } else {
            message += "Very Weak";
            severity = "error";
        }

        return (
            <Alert severity={severity}>{message}</Alert>
        )
  }
  
  const handlePasswordCompare = () => {
        if(password2.length === 0) return (<div></div>);
        if (password !== password2) {
            return (
                <Alert severity="error">Passwords do not match!</Alert>
            )
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const status = await updatePassword(password)
        if (status === 200) {
            handleLogout();
            navigate('/login');
        } else {
            console.log('Error')
        }
    }

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
        <Box
            display={'flex'}
            flexDirection={'column'}
            minHeight={'100vh'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
        <Menu user={token} />
            <Box maxWidth={'md'} sx={{top:'100px', bottom:'50px'}} display={'flex'} flexDirection={'column'}>
                <Typography variant={'h3'}>Change Password</Typography>
                <form>
                  <FormControl margin= {'normal'} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={'password'}
                            value={password}
                            onChange={(e) => handlePasswordChange(e)}
                            label="Password"
                        />
                    </FormControl>
                    {handlePasswordStrength()}
                    <FormControl margin= {'normal'} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={'password'}
                            value={password2}
                            onChange={(e) => handlePassword2Change(e)}
                            label="Password"
                        />
                    </FormControl>
                    {handlePasswordCompare()}
                    <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>Change Password</Button>
                    <p style={{marginTop: '10px'}}>Don't have an account? <a href="/login">Login</a></p>

                </form>
            </Box>
            <Footer isMobile={isMobile}/>
        </Box>
    );
}

export default ChangePassword;