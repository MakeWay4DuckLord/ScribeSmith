import './Home.css'
import { Link } from "react-router-dom";


export default function Home() {
    return ( 
        <>
            <header>
                <h1>ScribeSmith</h1>
                <nav>
                    <Link to="login"><button className='login'>Login</button></Link>
                    <button className='sign-up'>Sign Up</button>
                </nav>
            </header>
        </>
    );
}