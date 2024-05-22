
import React, { useState, useEffect } from 'react';

import axios from 'axios';

const CommentItem = ({ obj,postedTime, updateUpvote }) => {

    const [comVotes, setComVotes] = useState(obj.votes);
    // console.log({obj})
    //votes of comments not being updated correctly when changing page or adding new comment
    //added this to fix the problem above, but it does not update the vote count..
    useEffect(() => {
      setComVotes(obj.votes);
    }, [obj.votes]);


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      axios.get('http://localhost:8000/user/info', { withCredentials: true })
        .then(response => {
          setIsLoggedIn(true);
        })
        .catch(error => {
          setIsLoggedIn(false);
        });
    }, []);

    function upvoteComment() {
        axios.get('http://localhost:8000/user/info', { withCredentials: true })
          .then(response => {
            const userInfo = response.data;
            if (!userInfo) {
              alert(`You are not logged in.`);
            } else {
              axios.post(`http://localhost:8000/comments/upvote/${obj._id}`, {}, { withCredentials: true })
                .then(response => {
                  updateUpvote(obj._id)
                  setComVotes(response.data.votes);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            }
          })
          .catch(error => {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
              alert('You are not logged in');
            }
          });
      }

    return (
        <div>
        <div className="question_item">
        <div className="upvoteDownvote">
        {isLoggedIn && (<button className='voting' onClick={() => upvoteComment()}>Upvote</button>)}
          {/* <p id='voteNumber'>{comVotes[0]} votes</p> */}

        {/* {isLoggedIn && (<button className='voting' onClick={() => upvoteComment()}>Upvote</button>)} */}
        <p className='voteNumber'>
            {comVotes[0]}
        </p>
          </div>
          <p className='commentText'>{obj.text}</p>
            <div className="answerBy">
                <span className="usernameAnswer">{obj.commented_by.username}</span>
                <span className="timeSpanGray"><br/>commented {postedTime(new Date(obj.comment_date_time))}</span>
                {/* <span className="timeSpanGray"><br/>answered {postedTime(new Date(obj.ans_date_time))}</span> */}

            </div>
        </div>

        </div>
    );
};

export default CommentItem;
