import React from 'react';
import axios from 'axios';
const AnswerForm = ({qid, onPageChange, verifyText }) => {
    function resetErrorBorders() {
      // Remove error borders from all boxes errorBorder
      Array.from(document.getElementsByClassName("errorBorder")).forEach(id => {
        id.classList.remove("errorBorder");
      });
      Array.from(document.getElementsByClassName("errorMessage")).forEach((element) =>{
        element.style.display = "none";
      })
    }

      function verifyAnswer(){
        resetErrorBorders();
        var isValid = true;
        var isValidText = true;
        var isValidHyper = true;


        //text
        var atxtb = document.getElementById("answerTextBox")
        isValidText = atxtb.value.trim().length > 0

        if(!isValidText){
          atxtb.classList.add("errorBorder");
          document.getElementById("errorAnswerText").style.display = "block";
        }
        isValidHyper = verifyText(atxtb.value);
        if(!isValidHyper){
          atxtb.classList.add("errorBorder");
          document.getElementById("errorAnswerHyper").style.display = "block";
        }


      isValid = isValidHyper && isValidText && isValid;


        // //username
        // var user = document.getElementById("answerNameBox")
        // isValidUsername = user.value.trim().length > 0;
        // // console.log(isValidUsername);
        // if(!isValidUsername) {
        //   user.classList.add("errorBorder");
        //   document.getElementById("errorAnswerName").style.display = "block";
        // }
        // isValid = isValidUsername && isValid;


        if(isValid){
          const requestBody = {
            qid: qid._id,
            text: atxtb.value,
            // ans_by: user.value,
            ans_date_time: false
          };
          // model.insertAnswer(qid,atxtb.value,user.value);
          // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page

          axios.post('http://localhost:8000/answers/insertAnswer', requestBody, {withCredentials:true})
            .then(response => {
              // console.log(qid,"\n\n\n")
              console.log(typeof(response.data),response.data)
              onPageChange("answerPage", response.data);
            })
            .catch(error => {
              //error
              console.error('Error:', error);
            });
        }

      }

    return (
        <div id="answer-form" className="fill-form">
            {/* <h1>Username*</h1>
            <input type="text" name="answerNameBox" id="answerNameBox" className="text-box"/>
            <p className="errorMessage" id="errorAnswerName" style={{display: 'none'}}>Username must not be empty</p> */}

            <h1>Answer Text*</h1>
            <p className="small-text">Add details</p>
            <textarea type="text" name="answerTextBox" id="answerTextBox" className="text-box"></textarea>
            <p className="errorMessage" id="errorAnswerText" style={{display: 'none'}}>Text must not be empty</p>
            <p className="errorMessage" id="errorAnswerHyper" style={{display: 'none'}}>Error Parsing Hyperlink</p>
            <br/>
            <button id="postAnswer-button" className="post-button" onClick={() => verifyAnswer()}>Post Answer</button>
            <span className="mandatory">* indicates mandatory field</span>
        </div>
    );
};

export default AnswerForm;
