import React, { useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import CustomControls from "./CustomControls";
import L from 'leaflet';

function Map() {
	const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]);
	const [mosques, setMosques] = useState([]);
	const [isLoading, setIsLoading] = useState(false);


	return (
		<MapContainer
			center={currentLocation}
			zoom={13}
			scrollWheelZoom={false}
			zoomControl={false}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<CustomControls setCurrentLocation={setCurrentLocation} setIsLoading={setIsLoading} setMosques={setMosques}/>

			{isLoading && mosques.length === 0 ? <div>Loading...</div> : processMosques(mosques)}

			<Marker position={currentLocation} icon={
				new L.Icon({
					iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
					//correct the icon size
					iconSize: new L.Point(25, 41),
					//correct the icon anchor
					iconAnchor: new L.Point(13, 41),
					//correct the popup anchor
					popupAnchor: new L.Point(0, -33)
				}
				)
			}>
				<Popup>
					Your current location is: <br /> {currentLocation[0]}, {currentLocation[1]}
				</Popup>
			</Marker>

		</MapContainer>
	);
}

export default Map;


//function to process mosques array of objects and return all the markers
function processMosques(mosques) {
	const filteredMosques = mosques.filter(mosque => {
		//get the lat and lng
		const lat = mosque.lat;
		const lng = mosque.lon;
		//get the tags
		let name = "No Name";
		if (mosque.tags) {
			if (mosque.tags.name) {
				name = mosque.tags.name;
			}
		}else{
			//discard this one
			return false;
		}
		return lat && lng && name;
	});
	//if the mosques array is not empty, return all the markers
	if (filteredMosques.length > 0) {
		return filteredMosques.map((mosque, index) => {
			return (
				<Marker key={index} position={[mosque.lat, mosque.lon]} icon={
					new L.Icon({
						iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
						//correct the icon size
						iconSize: new L.Point(25, 41),
						//correct the icon anchor
						iconAnchor: new L.Point(13, 41),
						//correct the popup anchor
						popupAnchor: new L.Point(0, -33)
					}
					)
				}>
					<Popup>
						{mosque.tags ? (mosque.tags.name ? mosque.tags.name : "No Name") : "No Name"}
					</Popup>
				</Marker>
			)
		})
	}
}