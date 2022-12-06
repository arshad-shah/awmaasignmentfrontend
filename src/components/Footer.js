import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export default function Footer({ isMobile }) {
	const desktopStyles = {
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '10vh',
	};

	const mobileStyles = {
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem',
		marginBottom: '3rem',
		textAlign: 'center',
		alignItems: 'flex-start',
		justifyContent: 'center',
		minHeight: '10vh',
	};
	return (
		<Box data-testid="footer" sx={isMobile ? mobileStyles : desktopStyles}>
			<Typography variant="h6">
				&copy; {new Date().getFullYear()} Arshad Shah
			</Typography>
		</Box>
	);
}

Footer.propTypes = {
	isMobile: PropTypes.bool,
};
