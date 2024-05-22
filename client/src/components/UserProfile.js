
import React, { useRef, useState, useEffect } from 'react';
import ProfileQuestionForm from "./ProfileQuestionForm.js"
import ProfilePage from "./ProfilePage.js"
import ProfileAnswerPage from "./ProfileAnswerPage.js"
import ProfileAnswerForm from "./ProfileAnswerForm.js"
import AdminPage from "./AdminPage.js"
// import Model from '../models/model.js';

export default function UserProfile({userInfo,verifyText,welcome, forceRerender}) {
    const user = useRef(userInfo)
    // console.log(user.current)
    const [currentWindow,setCurrentWindow] = useState(user.current.isAdmin ? "adminPage" : "profilePage");

    const [obj,setObj] = useState(null);


    // console.log(forceRender)
    useEffect(() => {
        setCurrentWindow(user.current.isAdmin ? "adminPage" : "profilePage");
      }, [forceRerender]);

    const handleWindowChange = (window, obj) => {
        if(window === "welcome"){
            welcome(null)
        }
        setCurrentWindow(window);
        setObj(obj)
        // setForceRerender(prevState => !prevState); // Toggle the dummy state to force re-render
    };

// console.log(user.user.isAdmin)

     const renderCurrentWindow = () => {
        // console.log("x")
        window.scroll(0,0)
        switch (currentWindow) {
            case 'profileQuestionForm':
                return <ProfileQuestionForm onPageChange={handleWindowChange} obj={obj} verifyText={verifyText}/>; 
            case 'profilePage':
                return <ProfilePage onPageChange={handleWindowChange} user={user.current}/>;
            case 'profileAnswerPage':
                return <ProfileAnswerPage onPageChange={handleWindowChange} question={obj} user={user.current}/>;
            case 'profileAnswerForm':
                return <ProfileAnswerForm ans={obj} onPageChange={handleWindowChange} verifyText={verifyText} />;
            case 'adminPage':
                return <AdminPage users={user} ans={obj} onPageChange={handleWindowChange} verifyText={verifyText} />;

            default:
                return null;
        }
    };

    return (
        <div id='userProfile'>
                {renderCurrentWindow()}
        </div>
    );
}

