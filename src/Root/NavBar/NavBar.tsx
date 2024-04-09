import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';

const NavBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.authenticated);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(signOutUser());
    };

    const goHome = () => {
        navigate('/home');
    };

    // Check if the current path is one of the specified routes
    const shouldShowBackButton = ['/view-products', '/add-product', '/edit-product', '/stock-update'].some(
        path => location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    return (
        <AppBar position="static" sx={{ backgroundColor: '#685686;', flexDirection: 'row', minWidth: '100vw', height: 'inherit' }}>
            <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                    <a href='/home' style={{ textDecoration: 'none', color: 'inherit' }}>
                        e-stock
                    </a>
                </Typography>

                {isAuthenticated && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {shouldShowBackButton && (
                            <>
                                <IconButton color="inherit" onClick={goHome}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="button" color="inherit" onClick={goHome} sx={{ cursor: 'pointer' }}>
                                    Voltar
                                </Typography>
                            </>
                        )}
                        {shouldShowBackButton && <Box sx={{ bgcolor: 'white', width: '2px', height: '35px', mx: 2 }} />}
                        <Button color="inherit" onClick={handleLogout}>
                            Sair da Conta
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
