// import React from "react";
import React, { useState,useEffect} from 'react';
import axios from 'axios';
import AdminUserItem from "./AdminUserItem.js"

export default function AdminPage({onPageChange,users}) {

  const [currentUsers,setUsers] = useState([])







  useEffect(() => {
    try {
        axios.get('http://localhost:8000/user/allUsers',{withCredentials:true}).then( response =>{
        console.log(response.data.users)
        setUsers(response.data.users);
        })
        .catch(error=>{
            console.error("Error:",error)
        }

        );
    
        
    } catch (error) {
        console.error('Error fetching users:', error);
    }

  }, []);





return (
  <div >
    <div class='questions_header' style={{display:'flex'}}>
    <h1 style={{display:'inline'}}>Admin Profile</h1>
    </div>
    <hr className='solidLine'/>
    <div>
    {currentUsers.length > 0 ? (
        currentUsers.map((user, ind) => {
          return (
            <AdminUserItem users={users} key={ind} userInfo={user} onPageChange={onPageChange} setUsers = {setUsers}/>
          );
        })
      ) : (
        <div id="noQuestionsFoundMessage">No Users Found</div>
      )}
    </div>
    
  </div>
);

}
