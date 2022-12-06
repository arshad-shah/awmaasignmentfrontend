import React from 'react';
// eslint-disable-next-line max-len
import {
	AppBar,
	Box,
	Button,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText, Toolbar,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Close} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


export default function Menu({ user }) {
	const navigate = useNavigate();
	const drawerWidth = 240;
	const navItems = !user ? [] : ['Home', 'Map', 'Change Password', 'Update Details'];
	const locationForNavItems = !user ? [] : ['/', 'map', 'change-password', 'update-details'];
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<List>
				{navItems.map((item, index) => (
					<ListItem key={item} disablePadding>
						<ListItemButton sx={{ textAlign: 'center' }} href={locationForNavItems[index]}>
							<ListItemText primary={item} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			{/* eslint-disable-next-line max-len */}
			<AppBar component="nav" sx={{display:'flex', flexDirection:'row', placeContent:'space-between'}}>
				<Typography
					variant="h6"
					component="div"
					p={2}
					sx={{display:'flex', placeContent:'center', placeItems:'center'}}
				>
					Assignment 2
				</Typography>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						{!mobileOpen ? <MenuIcon /> : <Close/>}
					</IconButton>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button key={item} sx={{ color: '#000' }} onClick={
								() => {
									navigate(locationForNavItems[navItems.indexOf(item)]);
								}
							}>
								{item}
							</Button>
						))}
					</Box>
				</Toolbar>
			</AppBar>
			<Box component="nav">
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	);
}