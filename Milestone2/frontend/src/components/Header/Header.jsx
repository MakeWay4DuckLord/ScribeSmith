import './header.css'
import { Link } from "react-router-dom";
import { useLocation, Outlet,  useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../client/APIClient"


export default function Header() {
    const [currentUser, setCurrentUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        api.getCurrentUser().then(user => {
            console.log(user);
            setCurrentUser(user);
        }).catch(() => {
            setCurrentUser(null);
        });
    }, [location.pathname]);

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
                    <p>{currentUser.email}</p>
                    }
                </nav>
            </header>
            <Outlet />
        </>
    );
}