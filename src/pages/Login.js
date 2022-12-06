import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import {getToken, isTokenExpired} from "../utils/TokenService";
import { logout, saveToken, getTokenFromStorage } from "../utils/ApiCalls";
import { useNavigate } from "react-router-dom";


function Login({ isMobile, setUser }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handlePasswordChange = (event) => {
        setPassword( event.target.value);
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTheTokenExpired, setIsTheTokenExpired] = useState(false);
    const handleLoginError = () => {
        if (error) {
            return (
                <Alert severity="error">{error}</Alert>
            )
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const tokenRecieved = await getToken(username, password);
        if (tokenRecieved) {
            saveToken(tokenRecieved);
            setUser(tokenRecieved.access);
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    }
    useEffect(() => {
        const token =  getTokenFromStorage();
        if (token) {
            //call the api to check if the token is expired
            const isExpired = isTokenExpired(token);
            if (isExpired) {
                setIsTheTokenExpired(true);
                logout();
            }else{
                setIsTheTokenExpired(false);
                navigate('/');
            }
        }
    } ,[]);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            minHeight={'100vh'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
            <Menu/>
            <Box maxWidth={'md'} sx={{top:'100px', bottom:'50px'}} display={'flex'} flexDirection={'column'}>
                <Typography variant={'h3'}>Login</Typography>
                <form>

                    <FormControl margin= {'normal'} fullWidth>
                        <TextField id="standard-basic" label="Username" variant="outlined" color="secondary" onChange={(e) => handleUsernameChange(e)}/>
                    </FormControl>
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
                    {handleLoginError()}
                    <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>Login</Button>
                    <p style={{marginTop: '10px'}}>Don't have an account? <a href="/signUp">Sign up</a></p>

                </form>
            </Box>
            <Footer isMobile={isMobile}/>
        </Box>
    );
}

export default Login;