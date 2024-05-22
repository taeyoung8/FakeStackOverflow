
import React, { useState,useEffect, useRef } from 'react';
import QuestionForm from './QuestionForm.js';
import QuestionPage from './QuestionPage.js';
import AnswerPage from './AnswerPage.js';
import AnswerForm from './AnswerForm.js';
import Sidebar from './Sidebar.js';
import TagPage from './TagPage.js';
import UserProfile from "./UserProfile.js"

// import Model from '../models/model.js';

function PageControl({user,welcome}) {
    const [currentWindow, setCurrentWindow] = useState('questionPage');
    const [qid, setCurrentQuestion] = useState(undefined);

    const enter = useRef(undefined);

    const [forceRerender, setForceRerender] = useState(false);


    function verifyText(text) { //verify hyperlinks and text total
        // console.log(text)
        const startsWith = (word) => (word.trim()).startsWith("https://") || (word.trim()).startsWith("http://")

        let match = [-1, -1, -1, -1];
        let index = 0;
        let parse = ['[', ']', '(', ')'];
        let currentMatch = 0;


        for (let letter of text) {
          if (letter === parse[currentMatch]) {
            match[currentMatch] = index;
            currentMatch++;
          }

          if (currentMatch >= 4 && match[1] + 1 === match[2]) {
            const inBrackets = text.slice(match[0] + 1, match[1]);
            const inParentheses = text.slice(match[2] + 1, match[3]);

            if(!startsWith(inParentheses) || inBrackets.trim().length === 0){
                return false;
            }
            match = [-1, -1, -1, -1];
            currentMatch = 0;
          }

          index++;
        }

        return true;

      }

    //we can do document.querySelector('.search').value here (check if both are null first) to get the value of search when enter is pressed and change to question page



    const handleWindowChange = (window, newQid) => {

        if (newQid !== undefined) {
            setCurrentQuestion(newQid);
        }

        setCurrentWindow(window);
        // setForceRerender(prevState => !prevState); // Toggle the dummy state to force re-render
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log(enter)
                enter.current = document.querySelector(".search").value;
                setCurrentWindow("questionPage");
    //     //   renderCurrentWindow();
            }
        };
        var searchBox = undefined
        if(document.querySelector(".search")){
            searchBox = document.querySelector(".search")
            searchBox.addEventListener('keydown', handleKeyDown);

        }

        

        return () => {
            if(searchBox !== undefined){
                searchBox.removeEventListener('keydown', handleKeyDown);
            }
            
        };
    }, []);

    // console.log(welcome)

    const renderCurrentWindow = () => {
        // console.log("x")
        window.scroll(0,0)
        switch (currentWindow) {
            case 'questionForm':
                enter.current = undefined;
                return <QuestionForm onPageChange={handleWindowChange} verifyText={verifyText}/>; //needs no extra args
            case 'questionPage':
                // var temp = enter.current;
                // console.log(enter.current,temp)
                // enter.current = false;
                return <QuestionPage onPageChange={handleWindowChange} searchKey = {enter} forceRerender={forceRerender}/>; //needs no extra args
            case 'answerPage':
                enter.current = undefined;
                return <AnswerPage onPageChange={handleWindowChange} qid={qid}/>; //needs question id
            case 'answerForm':
                enter.current = undefined;
                return <AnswerForm onPageChange={handleWindowChange} qid={qid} verifyText={verifyText}/>; //need qid, will be there as prerequisite though
            case 'tagPage':
                enter.current = undefined;
                return <TagPage onPageChange={handleWindowChange} tagName = {enter} user={user}/>;
            case 'profilePage':
                enter.current = undefined;
                return <UserProfile userInfo={user.current.user} verifyText = {verifyText} welcome={welcome} forceRerender={forceRerender}/>;


            default:
                return null;
        }
    };

    function highlightSidebar(){
        switch(currentWindow){
            case "tagPage": return "tagsTab"
            case "profilePage": return "profileTab"
            default: return "questionsTab"
        }
    }

    return (
        <div className='all'>
            <Sidebar onPageChange={handleWindowChange} highlightedTab={highlightSidebar()} setRerender={setForceRerender} search={enter}/>

            <div className="container">
                {renderCurrentWindow()}
            </div>
        </div>
    );
}

export default PageControl;
