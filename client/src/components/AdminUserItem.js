import React from 'react';
import axios from 'axios';

const AdminUserItem = ({userInfo, onPageChange,users, setUsers}) => {

    function deleteUser(){
      // console.log(userInfo.)
      if(!window.confirm(`Are you sure you want to delete the user: ${userInfo.username}?`)){
        console.log("hello")
        return
      }
        const requestBody = {
            uid:userInfo._id
          };
          console.log(requestBody)
          // model.insertAnswer(qid,atxtb.value,user.value); 
          // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page
          axios.post('http://localhost:8000/user/DeleteUser', requestBody, {withCredentials:true})

            .then(response => {
              // console.log(qid,"\n\n\n")
              axios.get('http://localhost:8000/user/allUsers',{withCredentials:true}).then( response =>{
                // console.log(response.data.users)
                setUsers(response.data.users);
                })
                .catch(error=>{
                    console.error("Error:",error)
                })
              

            //   onPageChange("profilePage");

            })
            .catch(error => {
              //error
              console.error('Error:', error);
            });
    }

    function editUser(){
      // console.log({userInfo})
      const jsonInfo = {
        user: userInfo.username,
        id:userInfo._id,
        isAdmin:userInfo.isAdmin,
        reputation: userInfo.reputation,
        email: userInfo.email,
        creation_date_time:userInfo.creation_date_time
      }
      // console.log(jsonInfo)
      users.current = jsonInfo
      onPageChange("profilePage")
    }

//   const [ansVotes, setAnsVotes] = useState();


  

      // console.log(obj.votes)
    return (
        <div className='userItem'>
         <button onClick={() => editUser()} className='question_title' >{`${userInfo.username} (${userInfo.email})`}</button> 
         <button className='delete-button' onClick={() => deleteUser()}>Delete User</button>
          <hr/>
        </div>
    );
};

export default AdminUserItem;
