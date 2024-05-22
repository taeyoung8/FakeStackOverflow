// import React from "react";
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import ProfileQuestionPage from "./ProfileQuestionPage.js"
import ProfileTagPage from "./ProfileTagPage.js"


export default function ProfilePage({onPageChange, verifyText, user}) {

  const [currentPage,changePage] = useState('questions')

  const [rep,changeRep] = useState(user.reputation) 


  // console.log(user)

  // async function logout() {
  //   try {
  //     await axios.get('http://localhost:8000/logout',{withCredentials:true});
  //     onPageChange("welcome")


  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // }

  

  function postedTime(date) { //fixed date time, feel free to clean it further if you want

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    const secondsPast = parseInt((now.getTime() - date.getTime()) / 1000,10);
    if (secondsPast >= 86400) { //>=24hrs
      if (date < oneYearAgo) { // 1 year+
        const time = date.getFullYear() - now.getFullYear()
        return `${time} year${time !== 1 ? "s" : ""}`;
      } else { // 24hrs <= date < 1 year
        const time = Math.floor((now-date) / (86400000))
        return `${time} day${time !== 1 ? "s" : ""}`; //this needs to be big number since time will be in milliseconds
      }
    } else {


    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    const secondsPast = parseInt((now.getTime() - date.getTime()) / 1000,10);
    if (secondsPast >= 86400) { //>=24hrs
      if (date < oneYearAgo) { // 1 year+
        return `${date.getFullYear() - now.getFullYear()} years`;
      } else { // 24hrs <= date < 1 year
        return `${Math.floor((now-date) / (86400000))} days`; //this needs to be big number since time will be in milliseconds
      }
    } else {


      if (secondsPast < 60) {
        return `${secondsPast} second${secondsPast === 1 ? '' : 's'}`;
        // return `${secondsPast} second${secondsPast == 1 ? '' : 's'} ago`;
        // maybe change '==' to '<=' to make 0 second work?// 0 seconds is plural, only 1 second isnt plural idk why (same for every counting word)
      } else if (secondsPast < 3600) {
        const minutes = parseInt(secondsPast / 60,10);
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
      }
      const hours = parseInt(secondsPast / 3600,10);
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
  }

  }


  useEffect(() => {
    async function userInfo() {
      try {
        const response = await axios.get(`http://localhost:8000/user/info/${user.email}`,{withCredentials:true});
        // console.log(response.data)
        if(response.data.reputation !== rep){
          console.log(response.data)
          changeRep(response.data.reputation)
        }
    
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    userInfo()
  }, [rep,user]);



  function getPage(){
    switch(currentPage){
      case 'questions':{ //it has questions and answers in here
        return <ProfileQuestionPage onPageChange={onPageChange} isQuestion={true} user={user}/>
      }
      case 'answers':{ //it has questions and answers in here
        return <ProfileQuestionPage onPageChange={onPageChange} isQuestion={false} user={user}/>
      }
      case 'tags':{
        return <ProfileTagPage user = {user}/>
      }
      default:{
        return <ProfileQuestionPage onPageChange={onPageChange} user={user}/>
      }
    }
  }
  // console.log("user",user)


return (
  <div >
    <div className='questions_header' style={{display:'flex'}}>
    <h1 >User Profile</h1>
    {/* <button className='ask_button' onClick={() => logout()}>Logout</button> */}
    </div>
    <h1 style={{marginLeft:'20px'}}>Username: {user.user}</h1>
    <h1 style={{marginLeft:'20px'}}>Email: {user.email}</h1>
    <h1 style={{marginLeft:'20px'}}>Member for: {postedTime(new Date(user.creation_date_time))}</h1>
    {/* CHANEG THE REPUTATION TO DO IT ASYNC with server call */}

    <h1 style={{marginLeft:'20px'}}>Reputation: {rep}</h1> 



    <div id="profileButtons">
    <button className='profileButtons' onClick={() => changePage("questions")}>Questions</button>
    <button className='profileButtons' onClick={() => changePage("answers")}>Answers</button>
    <button className='profileButtons' onClick={() => changePage("tags")}>Tags</button>
    </div>
    <hr className="solidLine"/>
    <div>
        {getPage()}
    </div>

  </div>
);

}
