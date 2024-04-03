import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useAppSelector } from '../../ReduxStore/hooks'; // Adjust the import path as needed

const NavBar: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.authenticated);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
                <a href='/home'>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                        e-stock
                    </Typography>
                </a>
                {/* {isAuthenticated && (
                    <>
                        <Button
                            id="menu-button"
                            aria-controls={open ? 'menu-appbar' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleMenuClick}
                            sx={{ color: 'white' }}
                        >
                            Menu
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Gerenciar e-stock</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Consultar e-stock</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Exportar contagem</MenuItem>
                        </Menu>
                    </>
                )} */}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
