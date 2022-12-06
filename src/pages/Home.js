import React from 'react';
import {Box, Button, Container} from '@mui/material';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import * as PropTypes from 'prop-types';

function Home({user, handleLogout, isMobile}) {
	if (!user) {
		window.location.href = '/login';
	}

	return (
		<>
			<Box
				display={'flex'}
				flexDirection={'column'}
				minHeight={'100vh'}
				justifyContent={'space-between'}
			>
				<Menu user={user}/>
				<Container maxWidth={'md'} sx={{top:'50px', bottom:'50px'}}>
					<h1>Advanced Web Mapping 2022</h1>
					<h2>Assignment 2</h2>
					<h3>Student ID: C19485866</h3>
					<h3>Course ID: TU856</h3>
					<h3>Course Name: Computer Science</h3>
					<Button variant="contained" onClick={handleLogout}>Logout</Button>
				</Container>
				<Footer isMobile={isMobile}/>
			</Box>
		</>

	);

}

Home.propTypes = {
	user: PropTypes.object,
	handleLogin: PropTypes.func,
	handleLogout: PropTypes.func,
};

export default Home;