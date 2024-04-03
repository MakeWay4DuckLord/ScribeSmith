import './header.css'
import { Link, redirect } from "react-router-dom";
import { useLocation, Outlet,  useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../client/APIClient"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

export default function Header() {
    const [currentUser, setCurrentUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        api.getCurrentUser().then(user => {
            setCurrentUser(user);
        }).catch(() => {
            setCurrentUser(null);
        });
    }, [location.pathname]);

    const logoutUser = () => {
        api.logout().then(() => {
            console.log("HI");
            navigate('/login');
        }).catch((err) => {
            console.log(`Error loging out user: ${err}`)
        });
    }
    //TODO: Conditional rendering needs to be changed based on if a user is logged in, not based on path
    //TODO: Make conditional route, where if logged in, clicking on the logo brings to user campaigns page
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
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    <img src={currentUser.icon} alt="user icon" />
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={popupState.close}>Profile Settings</MenuItem>
                                    <MenuItem onClick={logoutUser}>Logout</MenuItem>
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