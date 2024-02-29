import './header.css'
import { Link } from "react-router-dom";
import { useLocation, Outlet,  useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";



export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    //TODO: Conditional rendering needs to be changed based on if a user is logged in, not based on path
    //TODO: Make a link to the previous page
    //TODO: Make conditional route, where if logged in, clicking on the logo brings to user campaigns page
    return ( 
        <>
            <header>
                <button className='back-button' onClick={() => {navigate(-1);}}>
                    <FiChevronLeft />
                </button>

                <Link to="/"><h1>ScribeSmith</h1></Link>
                <nav>
                    {(location.pathname === "/" || location.pathname === "/login" || location.pathname === "/sign-up") ?
                    <>
                        <Link to="login"><button className='login'>Login</button></Link>
                        <Link to="sign-up"><button className='sign-up'>Sign Up</button></Link>
                    </>                    
                    : 
                    <p>HI</p>
                    }
                </nav>
            </header>
            <Outlet />
        </>
    );
}