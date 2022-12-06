import {useMap} from "react-leaflet";
import React from "react";
import Control from "react-leaflet-custom-control";
import {IconButton} from "@mui/material";
import {FaMosque} from "react-icons/fa";
import {BiCurrentLocation} from "react-icons/bi";
import {Add as AddIcon, Remove} from "@mui/icons-material";
import { getMosques,updateLocation } from "../utils/LocationService";

function CustomControls({setCurrentLocation, setMosques, setIsLoading}) {
    const map = useMap();
    const [position, setPosition] = React.useState([51.505, -0.09]);
    const [zoom, setZoom] = React.useState(13);

    const handleLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition([position.coords.latitude, position.coords.longitude]);
                setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                map.setView([position.coords.latitude, position.coords.longitude], zoom);
                const location = { lat: (position.coords.latitude).toString(), lon: (position.coords.longitude).toString() };
                updateLocation(location);
                setIsLoading(false);
            });
        }
    }

    const handleZoomIn = () => {
        setZoom(zoom + 1);
        map.setView(position, zoom + 1);
    }

    const handleZoomOut = () => {
        setZoom(zoom - 1);
        map.setView(position, zoom - 1);
    }

    const handleMosques = () => {
        if (zoom > 10) {
            setZoom(10);
            map.setView(position, 15);
        }
        setIsLoading(true);
        getMosques(map.getBounds()).then(r => setMosques(r.elements));
        setIsLoading(false);
    }
    return(
        <>
            <Control prepend position='topright'>
                <IconButton color="default" sx={{width: "48px", height: "48px", border: "1px solid"}} onClick={handleMosques}>
                    <FaMosque />
                </IconButton>
            </Control>
            <Control prepend position='topright'>
                <IconButton color="default" sx={{width: "48px", height: "48px" , border: "1px solid"}} onClick={handleLocation}>
                    <BiCurrentLocation />
                </IconButton>
            </Control>
            {/* This control will be below the default zoom control. Note the wrapping Stack component */}
            <Control position='topright'>
                <IconButton color="default" sx={{width: "48px", height: "48px" , border: "1px solid"}} onClick={handleZoomIn}>
                    <AddIcon />
                </IconButton>
            </Control>
            <Control position='topright'>
                <IconButton color="default" sx={{width: "48px", height: "48px" , border: "1px solid"}} onClick={handleZoomOut}>
                    <Remove />
                </IconButton>
            </Control>
        </>
    )
}

export default CustomControls;