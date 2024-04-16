import './header.css'
import { Link, redirect } from "react-router-dom";
import { useLocation, Outlet,  useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../client/APIClient"

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
export default function Header() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userIcon, setUserIcon] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        api.getCurrentUser().then(user => {
            setCurrentUser(user);
            api.getUserIcon(user.userId).then(icon => {
                setUserIcon(icon);
            })
        }).catch(() => {
            setCurrentUser(null);
        });
    }, [location.pathname]);

    const handleOnClickLogoutUser = () => {
        api.logout().then(() => {
            navigate('/login');
        }).catch((err) => {
            console.log(`Error loging out user: ${err}`)
        });
    }

    const handleOnClickUserSettings = () => {
        navigate('/user-settings');
    }

    return (
        <>
            <header className='header-component'>
                <button className='back-button' onClick={() => {navigate(-1);}}>
                    <FiChevronLeft />
                </button>

                <Link to="/"><h1>ScribeSmith</h1></Link>
                <nav>
                    {(currentUser === null) ?
                    <>
                        <Link to="login"><button className='login'>Login</button></Link>
                        <Link to="sign-up"><button className='sign-up'>Sign Up</button></Link>
                    </>                    
                    :
                    <div>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                <Avatar alt="User icon"  src={userIcon} {...bindTrigger(popupState)} />
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={handleOnClickUserSettings}>User Settings</MenuItem>
                                    <MenuItem onClick={handleOnClickLogoutUser}>Logout</MenuItem>
                                </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                    </div>
                    
                    }
                </nav>
            </header>
            <Outlet />
        </>
    );
}