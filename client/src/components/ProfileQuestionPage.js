import React, { useState,useEffect } from 'react';
import QuestionItem from './QuestionItem.js';
import axios from 'axios';
export default function ProfilQuestionPage({onPageChange,isQuestion,user}) {

  // let currQuestions = [];
  const [quests, setQuestions] = useState([]); //originally used for just questions but it is used for question and answers, which answers are questions where user answered a question
  const [pageNumber,setPageNumber] = useState(0);



// console.log("Search: ",searchKey.current)






// console.log(quests)

// axios.get('http://localhost:8000/tags').then((res) => {
//   console.log(res.data)
// });








  useEffect(() => {


    async function getQuestionsById() {
      try {
        const response = await axios.get(`http://localhost:8000/users/questions/${user.email}`, {
      withCredentials: true,
    });
    // console.log("qwes",response)
        const questions = response.data;
        console.log(questions)
    
        questions.sort((a, b) =>new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(questions)
    
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    
    async function getAnswersById() {
      try {
        const response = await axios.get(`http://localhost:8000/users/answers/${user.email}`, {
      withCredentials: true,
    });
    
        const questions = response.data;
    
    
        questions.sort((a, b) =>new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(questions)
    
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    const handleData = async () => {
      try {

        isQuestion ? await getQuestionsById() : await getAnswersById();
    }catch (error) {
        console.error("Question Error: ", error);
      };
    }
    // console.log(isQuestion,user)
    handleData(); //need to prevent memory leak




  }, [isQuestion,user]);



// console.log(isQuestion)

  return (
    <div>


    <div style={{width:'100%'}} className="questions_main" id="questions_main">
      <div className="questions_header">
        <span className="all_questions">User {isQuestion ? "questions":"answers"}</span>
        {/* <button className='ask_button' onClick={() => onPageChange('questionForm')}>Ask Question</button> */}
      </div>
      <div className="questions_subheader">

        <span id="questionCount">{quests.length} question{quests.length === 1 ? '' : 's'}</span>
        {/* <div className="three_buttons">
          <button className="newest_button" onClick={() => sortedQuestions('newest')}>Newest</button>
          <button className="active_button" onClick={() => sortedQuestions('active')}>Active</button>
          <button className="unanswered_button" onClick={() => sortedQuestions('unanswered')}>Unanswered</button>

        </div> */}
      </div>
      <hr />
      <div id="questionsList">

      {quests.length > 0 ? (
        quests.slice(pageNumber*5, (pageNumber*5)+5).map((question, ind) => {
          // console.log()
          return (

            <QuestionItem key={ind} obj={question} onPageChange={onPageChange} isProfile={isQuestion ? "Questions":"Answers"}/>

          );
        })
      ) : (
        <div id="noQuestionsFoundMessage">No {isQuestion ? "Questions":"Answers"} Found</div>
      )}
      </div>
      <div className='prevNextButtonsContainer'>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber-1)} disabled={pageNumber <= 0}>Prev Page</button>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber+1)} disabled = {(pageNumber*5)+5 >= quests.length}>Next Page</button>

      </div>
    </div>
    </div>
  );
}
