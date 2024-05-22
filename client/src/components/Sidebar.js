import React, { useState,useEffect } from 'react';
import axios from 'axios';
export default function Sidebar({ onPageChange, highlightedTab, setRerender, search }) {

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

    return (
        <div className="menu_list">
            <ul className="menu">
                <li><button className={highlightedTab === 'questionsTab' ? 'highlight_background' : ''}

                id="questionsTab" onClick={() => {setRerender(prevState => !prevState);onPageChange('questionPage');search.current = undefined}}>Questions</button></li>

                <li><button className={highlightedTab === 'tagsTab' ? 'highlight_background' : ''}
                        id="tagsTab" onClick={() => onPageChange('tagPage')}>Tags</button></li>

                {isLoggedIn && (
                    <li><button className={highlightedTab === 'profileTab' ? 'highlight_background' : ''}
                    id="profileTab" onClick={() => {setRerender(prevState => !prevState); onPageChange('profilePage')}}>Profile</button></li>
                )}
                {/* <li><button className={highlightedTab === 'profileTab' ? 'highlight_background' : ''}
                        id="profileTab" onClick={() => onPageChange('profilePage')}>Profile</button></li> */}

            </ul>
        </div>
    );
}
