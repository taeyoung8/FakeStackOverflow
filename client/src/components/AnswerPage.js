import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnswerItem from './AnswerItem.js';
import CommentComponent from './CommentComponent.js';
export default function AnswerPage({ onPageChange,qid }) {

    const currentQuestion = qid;
    const currentAnswers = qid.answers.sort((a, b) =>new Date(b.ans_date_time) - new Date(a.ans_date_time));;
    // console.log(currentAnswers)
    const [votes, setVotes] = useState(currentQuestion.votes);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
      // console.log("press")
      axios.get('http://localhost:8000/questions/votes')
        .then(response => {
          const questionVotes = response.data.find(q => q._id === currentQuestion._id).votes;
          setVotes(questionVotes);
        })
        .catch(error => {
          console.error('Error fetching votes:', error);
        })
      } , [currentQuestion]);

    useEffect(() => {
      axios.get('http://localhost:8000/user/info', { withCredentials: true })
        .then(response => {
          setIsLoggedIn(true);
        })
        .catch(error => {
          setIsLoggedIn(false);
        });
    }, []);





      function parseHyperlinks(text) {
        // console.log(text)
        let elements = [];
        let match = [-1, -1, -1, -1];
        let index = 0;
        let parse = ['[', ']', '(', ')'];
        let currentMatch = 0;
        let lastMatch = -1;

        for (let letter of text) {
          if (letter === parse[currentMatch]) {
            match[currentMatch] = index;
            currentMatch++;
          }

          if (currentMatch >= 4 && match[1] + 1 === match[2]) {
            const inBrackets = text.slice(match[0] + 1, match[1]);
            const inParentheses = text.slice(match[2] + 1, match[3]);

            if (lastMatch !== match[0] - 1) {
              elements.push(<span key={lastMatch}>{text.slice(lastMatch + 1, match[0])}</span>);
            }

            elements.push(
              <a key={match[0]} href={inParentheses} target='_blank' rel="noreferrer">
                {inBrackets}
              </a>
            );

            lastMatch = match[3];
            match = [-1, -1, -1, -1];
            currentMatch = 0;
          }


          index++;
        }

        if (lastMatch !== text.length - 1) {
          elements.push(<span key={lastMatch}>{text.slice(lastMatch + 1)}</span>);
        }


        return elements;
      }

      function postedTime(date) { //fixed date time, feel free to clean it further if you want

        function formatTime(date) {//add starting 0's
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }

        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        const secondsPast = parseInt((now.getTime() - date.getTime()) / 1000,10);
        if (secondsPast >= 86400) { //>=24hrs
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          if (date < oneYearAgo) { // 1 year+
            return `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${formatTime(date)}`;
          } else { // 24hrs <= date < 1 year
            return `${month[date.getMonth()]} ${date.getDate()} at ${formatTime(date)}`;
          }
        } else {


          if (secondsPast < 60) {
            return `${secondsPast} second${secondsPast === 1 ? '' : 's'} ago`;
            // return `${secondsPast} second${secondsPast == 1 ? '' : 's'} ago`;
            // maybe change '==' to '<=' to make 0 second work?// 0 seconds is plural, only 1 second isnt plural idk why (same for every counting word)
          } else if (secondsPast < 3600) {
            const minutes = parseInt(secondsPast / 60,10);
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
          }
          const hours = parseInt(secondsPast / 3600,10);
          return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        }
      }
      // console.log(userInfo)
      function upvote() {
        axios.get('http://localhost:8000/user/info', { withCredentials: true })
          .then(response => {
            const userInfo = response.data;
            console.log(userInfo)
            if (userInfo.reputation < 50 && !userInfo.isAdmin) {
              alert(`Insufficient reputation to upvote (50 required).\nYour reputation is ${userInfo.reputation}.`);
            } else {
              axios.post(`http://localhost:8000/questions/upvote/${currentQuestion._id}`, {}, { withCredentials: true })
                .then(response => {
                  setVotes(response.data.votes);
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


      function downvote() {
        axios.get('http://localhost:8000/user/info', { withCredentials: true })
          .then(response => {
            const userInfo = response.data;

            if (userInfo.reputation < 50 && !userInfo.isAdmin) {
              alert(`Insufficient reputation to downvote (50 required).\nYour reputation is ${userInfo.reputation}.`);
            } else {
              axios.post(`http://localhost:8000/questions/downvote/${currentQuestion._id}`, {}, { withCredentials: true })
                .then(response => {
                  setVotes(response.data.votes);
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

      // console.log(currentQuestion)
      return (
        <div id="answersPage">
          <div className="question_item">

          <div className="upvoteDownvote">
          {isLoggedIn && (<button className='voting' onClick={() => upvote()}>Upvote</button>)}
          <p className='voteNumber'>Votes:  {votes[0]}</p>
          <p className='voteNumber'>Rating: {votes[1]}</p>
          {isLoggedIn && (<button className='voting' onClick={() => downvote()}>Downvote</button>)}
          </div>

          <div className="answers_and_views">

            <div>{currentQuestion.answers.length} answer{currentQuestion.answers.length === 1 ? "":"s"}</div>
            <div>{currentQuestion.views} view{currentQuestion.views === 1 ? "":"s"}</div>
          </div>
          <div className="question_content">
          <div id="questionTitle">{currentQuestion.title}</div>
            <p>{parseHyperlinks(currentQuestion.text)}</p>
            <div className="tags">
            {currentQuestion.tags.map((tag, ind) => (
              <span key={ind}>{tag.name}</span>
            ))}
          </div>
          </div>
          <div className="question_by">
          <span className='username'>{currentQuestion.asked_by.username}</span> asked {postedTime(new Date(currentQuestion.ask_date_time))}
          </div>

          </div>

          <CommentComponent obj={currentQuestion} type={"questions"} postedTime={postedTime}/>


            {/* <div id="allAnswersContainer">
                {currentAnswers.length > 0 ? (
                    currentAnswers.map((answer, ind) => {
                        return <AnswerItem key={ind} obj={answer} postedTime={postedTime} parseHyperlinks={parseHyperlinks}/>;
                    })
                ) : (
                    <div id="noAnswersFoundMessage">No Answers Found</div>
                )}
            </div> */}
            {/* next/prev page for answers - done, but it has the same problem with the first Todo */}
            <div id="answersList">
            {currentAnswers.length > 0 ? (
              currentAnswers.slice(pageNumber * 5, (pageNumber + 1) * 5).map((answer, ind) => {
                return <AnswerItem key={ind} obj={answer} postedTime={postedTime} parseHyperlinks={parseHyperlinks} />;
              })
            ) : (
              <div id="noAnswersFoundMessage">No answers found</div>
            )}
            </div>
            <div className='prevNextButtonsContainer'>

              <button className="pnButton" onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 0}>Prev Page</button>
              <button className="pnButton" onClick={() => setPageNumber(pageNumber + 1)} disabled={(pageNumber + 1) * 5 >= currentAnswers.length}>Next Page</button>
            </div>
            <div className="answerQuestion" id="answerQuestion">
                {isLoggedIn && (
                <button id="answer_button" className='answer_button' onClick={() => onPageChange('answerForm')}>Answer Question</button>
                )}
            </div>
        </div>
    );

}
