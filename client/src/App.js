// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React, {useState, useRef}  from 'react';
import './stylesheets/App.css';
import Navbar from './components/Navbar.js';
import WelcomePage from './components/WelcomePage.js'; 


import PageControl from './components/PageControl';

function App() {
  const [page, changePage] = useState("Welcome")
  const userInfo = useRef(null)
  function onChange(user){ //from login.js and welcomePage.js
      userInfo.current = user;

      changePage(page === "Welcome" ? "MainPage": "Welcome") //this is  a very lazy way of doing it but idc

    

  }

  function displayPage(){
    if(page === "Welcome"){
      return <WelcomePage onPageChange={onChange}/>
    }else{
      return(
        <div>
          <Navbar user={userInfo.current} welcome={onChange} />
      <PageControl user={userInfo} welcome={onChange}/>
        </div>

      )
    }
  }

  return (
    <section className="fakeso">
      {displayPage()}
        
    </section>
  );
}

export default App;
