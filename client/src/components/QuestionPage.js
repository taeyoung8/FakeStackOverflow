import React, { useState,useEffect, useCallback, useRef } from 'react';
import QuestionItem from './QuestionItem.js';
import axios from 'axios';
export default function QuestionPage({ onPageChange,searchKey,forceRerender}) {

  // let currQuestions = [];
  const [quests, setQuestions] = useState([]);
  const [pageNumber,setPageNumber] = useState(0);

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


// console.log("Search: ",searchKey.current)



async function getQuestions() {
  try {
    const response = await axios.get('http://localhost:8000/questions');
    const questions = response.data;
    // console.log(questions)


    return questions
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}


// console.log(quests)

// axios.get('http://localhost:8000/tags').then((res) => {
//   console.log(res.data)
// });




  const searchResults = useRef(false); //sets text to All questions or search results

  // console.log(quests)


  const sortedQuestions= (filterType) => {
    getQuestions().then((currQuestions) => {

    let filter;
    searchResults.current = false;
    switch(filterType){
      case "newest": currQuestions.sort((a, b) =>new Date(b.ask_date_time) - new Date(a.ask_date_time));
        filter = (q) => true;
        break;
        case "unanswered": currQuestions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        filter = (q) => q.answers.length === 0;
        break;
        case "active": currQuestions.sort((a, b) => Math.max(...(b.answers.map(obj => new Date(obj.ans_date_time)))) - Math.max(...(a.answers.map(obj => new Date(obj.ans_date_time)))));
        filter = (q) => q;
        break;
        case "search": currQuestions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        return separateTagsFromString(searchKey.current);

        default: return;
    }

    setQuestions(currQuestions.filter(filter));
    return;
  })
  };


  const separateTagsFromString = useCallback((inputString) => {
    // console.log(inputString)
    async function  findMatches(tags,words){

      getQuestions().then((qs) => {
        qs.sort((a, b) =>new Date(b.ask_date_time) - new Date(a.ask_date_time));
        var questions = []
        qs.forEach(question => {

        const hasMatchingWord = words.some(word => {
          return question.title.toLowerCase().includes(word) || question.text.toLowerCase().includes(word);
        });

        const hasMatchingTag = tags.some(tag => {
          return question.tags.map((t) => t.name).includes(tag.toLowerCase());
        });

        if (hasMatchingWord || hasMatchingTag) {

            questions.push(question)
        }

      });

      setQuestions(questions)
    })
    }


    // searchKey.current = undefined;
    // currQuestions = model.data.questions;
    const regex = /\[(.*?)\]/g; //regex for finding tags
    const tags = [];
    const words = [];
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(inputString)) !== null) {
      const tag = match[1];
      const beforeTag = inputString.substring(lastIndex, match.index).trim(); //search for words before the grabbed tag

      if (beforeTag !== "") { //if there is a word found, push
        beforeTag.split(' ').filter(word => word.trim() !== '').forEach(word => words.push(word.toLowerCase()))
        // words.push(beforeTag.toLowerCase());
      }

      tags.push(tag.toLowerCase());
      lastIndex = match.index + match[0].length;
    }

    const remainingText = inputString.substring(lastIndex).trim();
    if (remainingText !== "") {
      // words.push(remainingText);
      remainingText.split(' ').filter(word => word.trim() !== '').forEach(word => words.push(word.toLowerCase()))
    }



    findMatches(tags, words)
    return;
  }, []);



  useEffect(() => {
    const handleData = async () => {
      try {
        searchResults.current = false;

        const elements = await getQuestions();
        elements.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(elements);

        if (searchKey.current !== undefined) {
          const temp = searchKey.current;
          searchKey.current = undefined;
          searchResults.current = true;
          separateTagsFromString(temp);
        }
      } catch (error) {
        console.error("Question Error: ", error);
      }
    };

    handleData(); //need to prevent memory leak

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchResults.current = true;
        separateTagsFromString(document.querySelector(".search").value);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

    };
  }, [forceRerender, searchKey, separateTagsFromString]);





  return (
    <div className="questions_main" id="questions_main">
      <div className="questions_header">
        <span className="all_questions">{searchResults.current ? "Search Results" : "All questions"}</span>
        {/* <button className='ask_button' onClick={() => onPageChange('questionForm')}>Ask Question</button> */}
        {isLoggedIn && (
        <button className='ask_button' onClick={() => onPageChange('questionForm')}>Ask Question</button>
      )}
      </div>
      <div className="questions_subheader">
      
        <span id="questionCount">{quests.length} question{quests.length === 1 ? '' : 's'}</span>
        <div className="three_buttons">
          <button className="newest_button" onClick={() => sortedQuestions('newest')}>Newest</button>
          <button className="active_button" onClick={() => sortedQuestions('active')}>Active</button>
          <button className="unanswered_button" onClick={() => sortedQuestions('unanswered')}>Unanswered</button>

        </div>
      </div>
      <hr />
      <div id="questionsList">

      {quests.length > 0 ? (
        quests.slice(pageNumber*5, (pageNumber*5)+5).map((question, ind) => {
          return (
            <QuestionItem key={ind} obj={question} onPageChange={onPageChange} />
          );
        })
      ) : (
        <div id="noQuestionsFoundMessage">No Questions Found</div>
      )}
      </div>
      <div className='prevNextButtonsContainer'>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber-1)} disabled={pageNumber <= 0}>Prev Page</button>
        <button className="pnButton" onClick={()=>setPageNumber(pageNumber+1)} disabled = {(pageNumber*5)+5 >= quests.length}>Next Page</button>

      </div>
    </div>
  );
}
