import React from 'react';
import axios from 'axios';
const ProfileAnswerForm = ({ans, onPageChange, verifyText }) => {
  // console.log(ans.text)  
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


        

        if(isValid){
          const requestBody = {
            aid: ans._id,
            text: atxtb.value,
          };
          // model.insertAnswer(qid,atxtb.value,user.value); 
          // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page
          axios.post('http://localhost:8000/answers/modifyAnswer', requestBody, {withCredentials:true})

            .then(response => {
              // console.log(qid,"\n\n\n")
              // console.log(typeof(response.data),response.data)

              onPageChange("profilePage");

            })
            .catch(error => {
              //error
              console.error('Error:', error);
            });
          
          

        }

      }

    return (
        <div id="answer-form" className="fill-form">

            <h1>Answer Text*</h1>
            <p className="small-text">Add details</p>
            <textarea type="text" name="answerTextBox" id="answerTextBox" className="text-box" defaultValue={ans.text}></textarea>
            <p className="errorMessage" id="errorAnswerText" style={{display: 'none'}}>Text must not be empty</p>
            <p className="errorMessage" id="errorAnswerHyper" style={{display: 'none'}}>Error Parsing Hyperlink</p>
            <br/>
            <button id="postAnswer-button" className="post-button" onClick={() => verifyAnswer()} > Modify Answer</button>
            <span className="mandatory">* indicates mandatory field</span>
        </div>
    );
};

export default ProfileAnswerForm;