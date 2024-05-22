import React, { useState, useEffect } from 'react';
import CommentComponent from './CommentComponent.js';
import axios from 'axios';

const AnswerItem = ({ obj, postedTime, parseHyperlinks }) => {


  const [ansVotes, setAnsVotes] = useState(obj.votes);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const [comVotes, setComVotes] = useState(obj.comment.votes); //
  useEffect(() => {
    axios.get('http://localhost:8000/questions/votes')
      .then(response => {
      })
      .catch(error => {
        console.error('Error fetching votes:', error);
      });
  }, [obj._id]);

  useEffect(() => {
    axios.get('http://localhost:8000/user/info', { withCredentials: true })
      .then(response => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        setIsLoggedIn(false);
      });
  }, []);

  function upvoteAnswer() {
      axios.get('http://localhost:8000/user/info', { withCredentials: true })
        .then(response => {
          const userInfo = response.data;

          if (userInfo.reputation < 50 && !userInfo.isAdmin) {
            alert(`Insufficient reputation to upvote (50 required). Your reputation is ${userInfo.reputation}`);
          } else {
            axios.post(`http://localhost:8000/answers/upvote/${obj._id}`, {}, { withCredentials: true })
              .then(response => {
                setAnsVotes(response.data.votes);
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

    function downvoteAnswer() {
      axios.get('http://localhost:8000/user/info', { withCredentials: true })
        .then(response => {
          const userInfo = response.data;

          if (userInfo.reputation < 50 && !userInfo.isAdmin) {
            alert(`Insufficient reputation to downvote (50 required). Your reputation is ${userInfo.reputation}`);
          } else {
            axios.post(`http://localhost:8000/answers/downvote/${obj._id}`, {}, { withCredentials: true })
              .then(response => {
                setAnsVotes(response.data.votes);
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

      // console.log(obj.votes)
    return (
        <div>
        <div className="answerDiv">

        <div>

        {isLoggedIn && (<button className='voting' onClick={() => upvoteAnswer()}>Upvote</button>)}
        <p className='voteNumber'>Votes:  {ansVotes[0]}</p>
        <p className='voteNumber'>Rating: {ansVotes[1]}</p>
        {isLoggedIn && (<button className='voting' onClick={() => downvoteAnswer()}>Downvote</button>)}

        </div>
          {/* <p id='voteNumber'>Total:{ansVotes[0]} Rating:{ansVotes[1]}</p> */}
          <div className="answerText">{parseHyperlinks(obj.text)}</div>
            <div className="answerBy">
                <span className="usernameAnswer">{obj.ans_by.username}</span>
                <span className="timeSpanGray"><br/>answered {postedTime(new Date(obj.ans_date_time))}</span>

            </div>


          </div>

        <CommentComponent obj={obj} type={"answers"} postedTime={postedTime}/>
        </div>
    );
};

export default AnswerItem;
