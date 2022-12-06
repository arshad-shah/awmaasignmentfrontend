import React from 'react';
import Menu from "../components/Menu";
import {Box} from "@mui/material";
import Map from "../components/Map";

function MapPage({user}) {
    if (!user){
        window.location.href = window.location.href.replace('map', 'login');
    }
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            minHeight={'100vh'}
            justifyContent={'space-between'}
        >
            <Menu user={user}/>
            <Map/>
        </Box>
    );
}

export default MapPage;