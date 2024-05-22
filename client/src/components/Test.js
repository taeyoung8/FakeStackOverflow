import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Test() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function fetchData() {
          const result = await axios('http://localhost:8000/questions');
          setQuestions(result.data);
        }

        fetchData();
      }, []);

    return (
         <div>
        <div>
        {questions.map(question => (
          <div key={question._id}>
            <h3>Question Title: {question.title}</h3>
            <p>Question Text: {question.text}</p>
            <p>Tag Ids: {question.tagIds}</p>
            <p>Asked by: {question.asked_by}</p>
            <p>askDate: {question.ask_date_time}</p>
            <p>Ans Ids: {question.ansIds}</p>
            <p>Views: {question.views}</p>
          </div>
        ))}
      </div>
      </div>
    );
  }
