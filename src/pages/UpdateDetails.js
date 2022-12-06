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
import {isTokenExpired, updateProfile} from "../utils/TokenService";
import {getTokenFromStorage } from "../utils/ApiCalls";
import { useNavigate } from "react-router-dom";


function UpdateDetails({ isMobile, handleLogout }) {
    const navigate = useNavigate();

	const user = getTokenFromStorage();
	if (!user) {
		navigate('/login');
	}

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
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



    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const status = await updateProfile(firstname, lastname, email);
      if (status === 200) {
        navigate('/');
      } else {
        console.log('Error')
      }
  }


	useEffect(() => {
		Promise.resolve().then(async () => {
			const isExpired = await isTokenExpired(user);
		    //check if the token is expired
			if (isExpired) {
				handleLogout();
				navigate('/login');
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
            <Menu user={user}/>
            <Box maxWidth={'md'} sx={{top:'100px', bottom:'50px'}} display={'flex'} flexDirection={'column'}>
                <Typography variant={'h3'}>Change Password</Typography>
                <form>
                    <FormControl margin={'normal'} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-firstname">First Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-firstname"
                            type={'text'}
                            value={firstname}
                            onChange={(e) => handleFirstNameChange(e)}
                            label="First Name"
                        />
                    </FormControl>
                    <FormControl margin={'normal'} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-lastname">Last Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-lastname"
                            type={'text'}
                            value={lastname}
                            onChange={(e) => handleLastNameChange(e)}
                            label="Last Name"
                        />
                    </FormControl>
                    <FormControl margin={'normal'} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type={'text'}
                            value={email}
                            onChange={(e) => handleEmailChange(e)}
                            label="Email"
                        /> 
                    </FormControl>
                    {handleEmailValidation()}
                    <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>Update</Button>
                </form>
            </Box>
            <Footer isMobile={isMobile}/>
        </Box>
    );
}

export default UpdateDetails;