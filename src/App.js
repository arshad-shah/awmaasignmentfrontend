import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {
	createTheme,
	responsiveFontSizes,
	StyledEngineProvider,
	ThemeProvider,
	useMediaQuery,
} from '@mui/material';
import {getTokenFromStorage, logout} from './utils/ApiCalls';
import Home from './pages/Home';
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import MapPage from "./pages/MapPage";
import ChangePassword from "./pages/ChangePassword";
import UpdateDetails from './pages/UpdateDetails';
import {useNavigate} from "react-router-dom";



function App() {
	let theme = createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#ffe47a',
			},
			secondary: {
				main: '#ffbf0d',
			},
			background: {
				default: '#ffffff',
			},
			action: {
				hoverOpacity: 0.09,
			},
		},
		breakpoints: {
			values: {
				xs: 320,
				sm: 460,
				md: 786,
				lg: 1024,
				xl: 1440,
			},
		},
		typography: {
			fontFamily: 'Nunito Sans',
			fontSize: 18,
		},
	});

	theme = responsiveFontSizes(theme);

	const [user, setUser] = useState(getTokenFromStorage());

	const handleLogout = () => {
		console.log('logging out');
		setUser(null);
		logout();
		window.location.reload();	
	};

	const isMobile = useMediaQuery(theme.breakpoints.down('md'));


	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={<Login isMobile={isMobile} setUser={setUser} />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/change-password" element={<ChangePassword isMobile={isMobile} handleLogout={handleLogout} />} />
						<Route path="/update-details" element={<UpdateDetails isMobile={isMobile} handleLogout={handleLogout}/>} />
						<Route path={'/'} element={<Home user={user} handleLogout={handleLogout} isMobile={isMobile}/>}/>
						<Route path="/map" element={<MapPage user={user}/>}/>
						<Route path="*" element={<h1>404</h1>} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

export default App;
