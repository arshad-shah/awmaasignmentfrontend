import React from 'react';
import Menu from "../components/Menu";
import {Box} from "@mui/material";
import Map from "../components/Map";
import { useNavigate } from "react-router-dom";
import { getTokenFromStorage } from "../utils/ApiCalls";

function MapPage() {
    const navigate = useNavigate();
    const token =  getTokenFromStorage();
    if (!token){
        navigate('/login');
    }
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            minHeight={'100vh'}
            justifyContent={'space-between'}
        >
            <Menu user={token}/>
            <Map/>
        </Box>
    );
}

export default MapPage;