import React, {useState, useEffect} from 'react';
import Register from './Register.js';
import Login from './Login.js';
import axios from 'axios';
function InitalPage({changePage, changeWindow}){
    return(
        <div id='welcomeContent'>
            <p><button className="welcomeButton" onClick={() => changePage("Register")}>Register as new user</button></p>
            <p><button className="welcomeButton" onClick={() => changePage("Login")}>Login as existing user</button></p>
            {/* Figure out what to do for guest one */}
            <p><button className="welcomeButton" onClick={() => changeWindow(null)}>Continue as guest user</button></p>
        </div>
    );
}

export default function WelcomePage({onPageChange}) {
    const [currentPage, changePage] = useState("Initial")
    //check if logged in first and if they are then we can change welcome content accordingly


    useEffect(() => {
        const checkAuthentication = async () => {
        try {
            const response = await axios.get('http://localhost:8000/authorize',{ withCredentials: true });
            console.log(response);
            onPageChange(response.data)
        } catch (error) {
            console.error('Error auth:', error);
        }
        };

        checkAuthentication();
    }, [onPageChange]); // The empty dependency array ensures this effect runs only once, similar to componentDidMount


    function changeWelcomeContent(page){
        changePage(page);
    }

    function setPage(){
        switch(currentPage){
            case "Register": return <Register changePage={changePage}/>
            case "Login": return <Login changeWindow={onPageChange} changePage={changePage}/>
            default: return <InitalPage changePage={changeWelcomeContent} changeWindow={onPageChange}/>
        }
    }

    return (
        <div className="welcomePage">
        <h1 className="title">Fake Stack Overflow</h1>
        {setPage()}

    </div>
    );
  }
