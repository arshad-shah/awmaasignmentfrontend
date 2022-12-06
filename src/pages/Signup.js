import React, { useState} from 'react';
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
import {getToken, register} from "../utils/TokenService";
import { saveToken} from "../utils/ApiCalls";
import { useNavigate } from "react-router-dom";


function Signup({ isMobile }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');

    const handlePasswordChange = (event) => {
        setShowUserExists(false);
        setPassword( event.target.value);
    };
    const handleUsernameChange = (event) => {
        setShowUserExists(false);
        setUsername(event.target.value);
    }

    const handlePassword2Change = (event) => {
        setShowUserExists(false);
        setPassword2(event.target.value);
    }

    const handleEmailChange = (event) => {
        setShowUserExists(false);
        setEmail(event.target.value);
    }

    const handlePasswordCompare = () => {
        if(password2.length === 0) return (<div></div>);
        if (password !== password2) {
            return (
                <Alert severity="error">Passwords do not match!</Alert>
            )
        }
    }

    const handleEmailValidation = () => {
        if (email.length === 0) return (<div></div>);
        
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email.match(emailRegex)) {
            return (
                <Alert severity="error">Invalid email!</Alert>
            )
        }
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTheTokenExpired, setIsTheTokenExpired] = useState(false);
    const [showUserExists, setShowUserExists] = useState(false);

    const handleUserExists = (username) => {
        const message = `A user with that username ${username} already exists!`;
        return (
            <Alert severity="error">{message}</Alert>
        )
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        //register the user
        const usernameRecieved = await register(username, password, email);
        if (usernameRecieved !== "A user with that username already exists.") {
            //get a token
            const tokenRecieved = await getToken(username, password);
            if (tokenRecieved) {
                saveToken(tokenRecieved);
                //wait for the token to be saved
                await new Promise(r => setTimeout(r, 1000));
                navigate('/');
            } else {
                setError("Invalid username or password");
            }
        } else {
            setShowUserExists(true);
        }
    }

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
                <Typography variant={'h3'}>Signup</Typography>
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
                    <FormControl margin={'normal'} fullWidth>
                        <TextField id="standard-basic" label="Email" variant="outlined" color="secondary" onChange={(e) => handleEmailChange(e)} />
                    </FormControl>
                    {handleEmailValidation()}
                    {handlePasswordCompare()}
                    {showUserExists ? handleUserExists(username) : <div></div>}
                    <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>Sign up</Button>
                    <p style={{marginTop: '10px'}}>Already Have an account? <a href="/login">Login</a></p>

                </form>
            </Box>
            <Footer isMobile={isMobile}/>
        </Box>
    );
}

export default Signup;