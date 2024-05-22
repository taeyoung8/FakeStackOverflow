import React, { useState,useRef,useEffect } from 'react';

import CommentItem from './CommentItem.js';
import axios from 'axios';

export default function CommentComponent({obj,type,postedTime}) {


    // console.log(obj)
  
  // let currQuestions = [];
  const commentRef = useRef(null);
  const error1 = useRef(null);
  const error2 = useRef(null);

  const [currObj,setObj] = useState(obj);
  const [pageNumber,setPageNumber] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // console.log(commentRef)
  useEffect(() => {
    // console.log(currObj)
    const handleKeyDown = (event) => {
      // Check if the pressed key is Enter (key code 13)
      if (event.key === 'Enter') {
        // Your code to handle the Enter key press here
        // console.log("comment")
        addComment()
        // console.log('Enter key pressed in textarea!');
      }
    };
    let inpBox = undefined
    if(isLoggedIn){
      inpBox = commentRef.current
      inpBox.addEventListener('keydown', handleKeyDown);
    }

    // Attach the event listener when the component mounts
    // commentRef.current.addEventListener('keydown', handleKeyDown);

    // // Clean up the event listener when the component unmounts
    return () => {
      if(inpBox!==undefined){
      inpBox.removeEventListener('keydown', handleKeyDown);
      }
    };
  });

  useEffect(() => {
    if(currObj){
      currObj.comments.sort((a, b) => new Date(b.comment_date_time) - new Date(a.comment_date_time));
    }
    if(!isLoggedIn){
      axios.get('http://localhost:8000/user/info', { withCredentials: true })
      .then(response => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        setIsLoggedIn(false);
      });
  }
    },[currObj,isLoggedIn]
  );

  function resetErrorBorders() {
    // Remove error borders from all boxes
    Array.from(document.getElementsByClassName("errorBorder")).forEach(id => {
      id.classList.remove("errorBorder");
    });
    Array.from(document.getElementsByClassName("errorMessage")).forEach((element) =>{
      element.style.display = "none";
    })
  }

  function addComment(){
    resetErrorBorders()
    const comment = commentRef.current
    if(comment.value.trim().length === 0){
      error2.current.style.display = "block"
      return;
    }else if(comment.value.trim().length > 140){
      error1.current.style.display = "block"
      return;
    }
    // console.log('Comment State:', comment.value);
    const requestBody = {
      text: comment.value
    }

    axios.get('http://localhost:8000/user/info', { withCredentials: true })
      .then(response => {
      const userInfo = response.data;
      if (userInfo.reputation < 50 && !userInfo.isAdmin) {
        alert(`Insufficient reputation to comment (50 required).\nYour reputation is ${userInfo.reputation}.`);
      } else {
        axios.post(`http://localhost:8000/${type}/addComment/${obj._id}`, requestBody, {withCredentials: true,})
        .then(response => {
          // console.log(obj,response.data)
          response.data.comments.sort((a, b) => new Date(b.comment_date_time) - new Date(a.comment_date_time));
          commentRef.current.value = "";
          // console.log("comment added")
          setObj(response.data);
          setPageNumber(0);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }

    });
  
  }

  function upvoteComment(id){

    // Update the comments array in the ref
    var newObj = currObj
    newObj.comments.map((comment) => {
      // console.log(id,comment._id)
      if (comment._id === id) {
        
        comment.votes[0]+=1;
        comment.votes[1]+=1;
        // console.log(comment)
        return comment;
      }
      return comment;
    });
    // console.log("new",newObj)
    setObj(newObj)
    // console.log(currObj.current.comments)
  }

  return (
    <div>
    <hr className='solidLine'/>
      <div className="questions_subheader">

        <span id="questionCount">{currObj.comments.length} comment{currObj.comments.length === 1 ? '' : 's'}</span>

      </div>

      <div id="questionsList">

      {currObj.comments.length > 0 ? (
        currObj.comments.slice(pageNumber*3, (pageNumber*3)+3).map((comment, ind) => {
          return (
            <CommentItem key={ind} obj={comment} postedTime={postedTime} updateUpvote = {upvoteComment}/>

          );
        })
      ) : (
        <div id="noQuestionsFoundMessage"></div>
      )}
      </div>
      <div id='prevNextButtonsContainer'>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber-1)} disabled={pageNumber <= 0}>Prev Page</button>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber+1)} disabled = {(pageNumber*3)+3 >= currObj.comments.length}>Next Page</button>

      </div>

          {isLoggedIn && (
                <>
                <p className="small-text">Limit comment to 140 characters or less</p>
                <p className="errorMessage" ref={error1} style={{display: 'none'}}>Comments must be 140 characters or less</p>
                <p className="errorMessage" ref={error2} style={{display: 'none'}}>Comments must not be empty</p>
                <textarea id='questionComment' ref={commentRef} placeholder='Add comment'></textarea>
                <button id="addCommentButton" onClick={() => addComment()}>Add Comment</button>
                </>
                )}

          <hr/>
          </div>
    //   <hr/>

    // </div>
  );
}
