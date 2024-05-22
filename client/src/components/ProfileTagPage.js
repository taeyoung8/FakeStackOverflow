import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProfileTagItem from './ProfileTagItem.js';


const ProfileTagPage = ({ user }) => {
  const [tagCounts, setTagCounts] = useState({});

  const [rerender, setRererender] = useState(false);


  const countTags = useCallback(async (user) => {
    try {

      const questions = await getQuestions(user);
      const count = {};
      questions.forEach((element) => {
        element.tags.forEach((tag) => {
          tag = tag.name;
          count[tag] = count[tag] + 1 || 1; //sets to 1 if DNE in hashmap
        });
      });
      setTagCounts(count);

    } catch (error) {
      console.error('Error with tags:', error);
    }
  },[]);

  function forceRerender(){
    setRererender(!rerender)
  }


  useEffect(() => {
    countTags(user);
    // setRererender(!rerender)
  }, [user,countTags,rerender]);

  const getQuestions = async (user) => {
    try {
      const response = await axios.get(`http://localhost:8000/users/questions/${user.email}`, { withCredentials: true });
      const questions = response.data;
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  
  return (
    <div className="tagsPage" id="tagsPage">
      <div className="topBar">
        <h1 className="nTags" id="nTags">
          {Object.keys(tagCounts).length} Tags
        </h1>

      </div>
      <div className="tagContainer" id="tagContainer">
        {Object.keys(tagCounts).map((tag, index) => (
          
          <ProfileTagItem user={user} tag={tag} tagCount={tagCounts[tag]} countTags={countTags} key={tag} force={forceRerender} />
        ))}
      </div>
    </div>
  );
};

export default ProfileTagPage;
