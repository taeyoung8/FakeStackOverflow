import React from 'react';
import axios from 'axios';

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

const QuestionItem = ({ obj, onPageChange, isProfile}) => {
  // let currObj = obj
  // console.log({obj})

  function titleClicked(){
    console.log({isProfile})
    if(isProfile === undefined){
    axios.post(`http://localhost:8000/questions/addView/${obj._id}`)
        .then(newObj => {
          console.log("id: ",newObj.data)
          onPageChange("answerPage",newObj.data)
        })
        .catch(error => {
          //error

          console.error('Error:', error);
        });
      }else if(isProfile === "Questions"){
        // console.log("here")
        onPageChange("profileQuestionForm",obj) //this is a different onPageChange than the above 1, maybe bad practice?
      }
      else if(isProfile === "Answers"){
        // console.log("here")
        onPageChange("profileAnswerPage",obj)
      }

  }

  // console.log({isProfile})

  return (
    <div>
    <div className="question_item">


      <div className="answers_and_views">

        <div>{obj.votes[0]} Total Votes</div>

        <div>{obj.answers.length} answer{obj.answers.length === 1 ? "":"s"}</div>
        <div>{obj.views} view{obj.views === 1 ? "":"s"}</div>
      </div>
      <div className="question_content">
        <button className="question_title" onClick={() => titleClicked()}>{obj.title}</button>
        <p>{obj.summary}</p>
        <div className="tags">
        {obj.tags.map((tag, ind) => (
          <span key={ind}>{tag.name}</span>
        ))}
      </div>
      </div>
      <div className="question_by">
      <span className='username'>{obj.asked_by.username}</span> asked {postedTime(new Date(obj.ask_date_time))}
      </div>

    </div>
    <hr/>
    </div>
  );
};


export default QuestionItem;
