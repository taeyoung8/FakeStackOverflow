import React from "react";
import axios from 'axios';
export default function QuestionForm({onPageChange, verifyText}) {

  function resetErrorBorders() {
    // Remove error borders from all boxes
    Array.from(document.getElementsByClassName("errorBorder")).forEach(id => {
      id.classList.remove("errorBorder");
    });
    Array.from(document.getElementsByClassName("errorMessage")).forEach((element) =>{
      element.style.display = "none";
    })
  }



  function verifyQuestion(){ //Im doing individual checks for unique error msgs, we can make it cleaner if we dont want unique msgs
    resetErrorBorders();
    //moved button clicks to  onload function



    var isValid = true;
    var isValidText = true;
    // var isValidTags = true;
    var isValidSummary = true;
    var isValidHyper = true;
    var isValidTitle = true;


    //title
    var qtb = document.getElementById("questionTitleBox");
    // console.log('qtb length: '+qtb.value.trim().length);

    if(qtb.value.length > 100 ) {
      qtb.classList.add("errorBorder");
      document.getElementById("errorQuestionTitle1").style.display = "block";
      isValidTitle = false;
    }
    else if(qtb.value.trim().length === 0){
      qtb.classList.add("errorBorder");
      document.getElementById("errorQuestionTitle2").style.display = "block";
      isValidTitle = false;
    }

    isValid = isValid && isValidTitle

    //text
    var qtxtb = document.getElementById("questionTextBox")
    isValidText = qtxtb.value.trim().length > 0

    if(!isValidText){
      qtxtb.classList.add("errorBorder");
      document.getElementById("errorQuestionText").style.display = "block";
    }
    isValidHyper = verifyText(qtxtb.value);
    if(!isValidHyper){
      qtxtb.classList.add("errorBorder");
      document.getElementById("errorQuestionHyper").style.display = "block";
    }


    isValid = isValidHyper && isValidText && isValid;


    //tags
    var tags = document.getElementById("questionTagsBox")
    var allTags = tags.value.split(' ').filter(word => word.trim() !== '').map(tag=>tag.toLowerCase()); //filter out extra spaces + make lowercase
    allTags = Array.from(new Set(allTags)) // filter out for only unique
    if(allTags.length === 0){ //check that it isnt empty
      isValid = false;

      tags.classList.add("errorBorder");
      document.getElementById("errorQuestionTags1").style.display = "block";
    }else{
      if(allTags.length > 5){ //at most 5 tags
        document.getElementById("errorQuestionTags2").style.display = "block";
        isValid = false;
      }
      var fit = true
      for (let i = 0; i < allTags.length; i++) { //check that each tag is 10 characters or less
        if(allTags[i].length>10){
          document.getElementById("errorQuestionTags3").style.display = "block";
          fit = false;
          break;
      }
    }
      if(!fit){

        isValid = false;
        tags.classList.add("errorBorder");
      }

    }


    // //username
    // var user = document.getElementById("questionNameBox")
    // isValidUsername = user.value.trim().length > 0;
    // // console.log(isValidUsername);
    // if(!isValidUsername) {
    //   user.classList.add("errorBorder");
    //   document.getElementById("errorQuestionName").style.display = "block";
    // }
    // isValid = isValidUsername && isValid;

      //Summary Check
      var summary = document.getElementById("questionSummaryBox")
      if(summary.value.trim().length > 140){
        document.getElementById("errorQuestionSummary1").style.display = "block";
        isValidSummary = false;
      }else if(summary.value.trim().length === 0){
        document.getElementById("errorQuestionSummary2").style.display = "block";
        isValidSummary = false;
      }
      if(!verifyText(summary.value)){
        document.getElementById("errorQuestionSummary3").style.display = "block";
        isValidSummary = false;
      }
      isValid = isValid && isValidSummary

      if(isValidSummary === false) {
        summary.classList.add("errorBorder");
      }


    // console.log(allTags)
    if(isValid){

      const requestBody = {
        title: qtb.value,
        text: qtxtb.value,
        tags: allTags,
        answers: [],
        ask_date_time: false,
        views: false,
        summary:summary.value,
      };
      // model.insertAnswer(qid,atxtb.value,user.value);
      // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page

      axios.get('http://localhost:8000/user/info', { withCredentials: true })
      .then(response => {
        const userInfo = response.data;
        axios.post('http://localhost:8000/questions/insertQuestion', requestBody,{ withCredentials: true})
        .then(response => {
          onPageChange("questionPage")
        })
        .catch(error => {
          //error
          console.error('Error:', error);
          if (error.response && error.response.status === 401) {
            alert(`Insufficient reputation to create a new Tag (50 required).\nYour reputation is ${userInfo.reputation}.`);
          }
        });
      })




    }
    else{
      return;
   }
  }



return (
  <div className="fill-form" id="question-form">
    <h1>Question Title*</h1>
    <p className="small-text">Limit title to 50 characters or less</p>
    <input type="text" name="questionTitleBox" id="questionTitleBox" className="text-box" />
    <p className="errorMessage" id="errorQuestionTitle1" style={{display: 'none'}}>Title must be 100 characters or less</p>
    <p className="errorMessage" id="errorQuestionTitle2" style={{display: 'none'}}>Title must not be empty</p>

    <h1>Question Summary*</h1>
    <p className="small-text">Limit title to 140 characters or less</p>
    <textarea type="text" name="questionSummaryBox" id="questionSummaryBox" className="text-box" />
    <p className="errorMessage" id="errorQuestionSummary1" style={{display: 'none'}}>Summary must be 140 characters or less</p>
    <p className="errorMessage" id="errorQuestionSummary2" style={{display: 'none'}}>Summary must not be empty</p>
    <p className="errorMessage" id="errorQuestionSummary3" style={{display: 'none'}}>Error Parsing Hyperlink</p>

    <h1>Question Text*</h1>
    <p className="small-text">Add details</p>
    <textarea type="text" name="questionTextBox" id="questionTextBox" className="text-box"></textarea>
    <p className="errorMessage" id="errorQuestionText" style={{display: 'none'}}>Text must not be empty</p>
    <p className="errorMessage" id="errorQuestionHyper" style={{display: 'none'}}>Error Parsing Hyperlink</p>

    <h1>Tags*</h1>
    <p className="small-text">Add keywords separated by whitespace</p>
    <input type="text" name="questionTagsBox" id="questionTagsBox" className="text-box" />
    <p className="errorMessage" id="errorQuestionTags1" style={{display: 'none'}}>Tags must not be empty</p>
    <p className="errorMessage" id="errorQuestionTags2" style={{display: 'none'}}>Only 5 tags can be used</p>
    <p className="errorMessage" id="errorQuestionTags3" style={{display: 'none'}}>Each tag must be 10 characters or less</p>


    {/* <h1>Username*</h1>
    <input type="text" name="questionNameBox" id="questionNameBox" className="text-box" />
    <p className="errorMessage" id="errorQuestionName" style={{display: 'none'}}>Username must not be empty</p> */}

    <br/><br/>
    <button id="postQuestion-button" className="post-button" onClick={() => verifyQuestion()}>Post Question</button>
    <span className="mandatory">* indicates mandatory field</span>
  </div>
);

}
