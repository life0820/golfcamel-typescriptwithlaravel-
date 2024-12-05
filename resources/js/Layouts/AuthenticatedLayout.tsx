import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { NavItems as navItems } from "@/Config/nav.config";

import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    Button, Menu, MenuItem, ListItemIcon, Badge,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window,
    header: any,
    children: any
}

const drawerWidth = 240;

export default function AuthenticatedLayout({ header, children, window }: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = usePage().props.auth.user;

    const isMenuOpen = Boolean(anchorEl);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id='account-menu'
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link href={route('profile.edit')} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
            </Link>
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <AddShoppingCartRoundedIcon />
                </ListItemIcon>
                <ListItemText>Cart</ListItemText>
                <Typography variant="body2" sx={{ color: 'red' }}>
                    4
                </Typography>
            </MenuItem>
            <Link href={route('logout')} method="post" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Log out</ListItemText>
                </MenuItem>
            </Link>
        </Menu>
    );

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <ApplicationLogo className="tw-block tw-h-9 tw-w-auto tw-fill-current tw-text-gray-800" />
            <Divider />
            <List>
                {navItems.map((item) => (
                    <Link  key={item.key} href={item.route} style={{ textDecoration: 'none' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText primary={item.title} sx={{ color: 'gray' }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <Box sx={{ height: 80 }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar className="tw-justify-between">
                    <Box className="tw-flex tw-items-center">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img alt="logo" src={"/assets/image/logo/logo1.jpg"} width={80} />
                        <Box sx={{ ml: 2, display: {xs: 'none', sm: 'block'}}}>
                            {navItems.map((item) => (
                                <Link
                                    href={item.route}
                                    key={item.key}
                                    className={
                                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                                        (route().current() === item.route
                                            ? 'tw-border-solid  tw-border-white tw-text-red-500 tw-bg-white focus:tw-border-white-300 focus:tw-text-white-700 tw-mr-3 tw-px-3 tw-py-1.5 tw-transition tw-duration-200'
                                            : 'tw-border-solid tw-border-white tw-text-white hover:tw-border-white-300 hover:tw-text-red-500 hover:tw-bg-white focus:tw-border-white-300 focus:tw-text-white-700 tw-mr-3 tw-px-3 tw-py-1.5 tw-transition tw-duration-200')
                                    }
                                    style={{ borderWidth: 1, borderRadius: '16px', textDecoration: 'none' }}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </Box>
                    </Box>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="account-menu"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        className="tw-float-end"
                    >
                        <Badge badgeContent={4} color="info">
                            <AccountCircle />
                        </Badge>
                    </IconButton>
                    {renderMenu}
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
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
            </nav>
            {header && (
                <header className="tw-bg-white tw-shadow tw-mt-20 tw-relative" style={{ zIndex: 1 }}>
                    <div className="tw-mx-auto tw-max-w-7xl tw-px-3 tw-py-3 sm:tw-px-6 lg:tw-px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </Box>
    );
}
