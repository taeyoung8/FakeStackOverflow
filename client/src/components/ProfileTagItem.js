import React, { useState } from 'react';
import axios from 'axios';

const ProfileTagItem = ({ user, tag, tagCount, countTags, force }) => {

    const [modifying, setModifying] = useState(false);
    const [inputValue, setInputValue] = useState(tag);
    const [errorMsg, setErrorMsg] = useState("");
  // const [comVotes, setComVotes] = useState(obj.comment.votes); //


  async function deleteTag(){
    const requestBody = {
      tagName: tag,
      email: user.email
    };
    // console.log(requestBody)


        axios.post('http://localhost:8000/tags/deleteTag', requestBody,{ withCredentials: true})
        .then(response => {
          console.log(response)
          // countTags(user.user)
          force()
        })
        .catch(error => {
          //error
          console.error('Error:', error);
          setErrorMsg("Tags in use by other users cannot be deleted")
        });

  }

  function verifyText(){
    var valid = true
    var str = ""
    if(inputValue.length === 0){
        setErrorMsg("Cannot be empty tag")
        return false;
    }
    if(inputValue.length > 10){
        str = "Must be at most 10 characters"
        valid = false;
    }
    if(inputValue.includes(" ")){
        valid = false;
        if(str.length > 0){
            str+= " and contains no spaces"
        }else{
            str = "Must contain no spaces"
        }
    }
    if(!valid){
    return str
    }else{
        return ""
    }

  }

  async function modifyTag(){

    var str = verifyText()
    if(str.length !== 0){
      setErrorMsg(str)
      return
    }

    const requestBody = {
      tagName: tag,
      email: user.email,
      newTagName:inputValue
    };
    // console.log(requestBody)


        axios.post('http://localhost:8000/tags/modifyTag', requestBody,{ withCredentials: true})
        .then(response => {
            // console.log(user.user)
          // countTags(user.user)
          // setModifying(false)
          force()
          setErrorMsg("")
        })
        .catch(error => {
          //error will be bc u cannot modify since its in use
          setErrorMsg("Tags in use by other users cannot be modified")
            // alert(`Unable to delete this tag.`);
        });

  }
  function endModify(){
    setErrorMsg("")
    setModifying(!modifying)
  }

      // console.log(obj.votes)
    return (
        <div className="box">
            <div style={{ color: 'red' }}>{errorMsg}</div>
              {!modifying ? <p>{tag}</p> : <input type='text' defaultValue={inputValue} style={{ width: '60%' }} onChange={(e) => setInputValue(e.target.value)}/>}
              <div>{tagCount} question{tagCount === 1 ? '' : 's'}</div>
              {!modifying ? <button onClick={() => setModifying(!modifying)} className='profileTagButtons'>Modify</button> : <button className='profileTagButtons' onClick={() => modifyTag()}>Confirm</button>}
              
              {modifying ? <button onClick={() => endModify()} className='profileTagButtons'>Cancel</button> : <button className='profileTagButtons' onClick={() => deleteTag(tag)}>Delete</button>}

              {/* <button className='profileTagButtons' onClick={() => deleteTag(tag)}>Delete</button> */}
            </div>
    );
};

export default ProfileTagItem;
