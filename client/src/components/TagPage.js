import React from 'react';
import axios from 'axios';

class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagCounts: {}
    };
  }
  

  componentDidMount() {
    this.countTags();
  }


  async getQuestions() {
    try {
      const response = await axios.get('http://localhost:8000/questions');
      const questions = response.data;
  
  
      
      return questions
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }


  countTags() {

    var count = {};
    this.getQuestions().then((qs)=>{
      // console.log(qs)
      qs.forEach((element) => {
        element.tags.forEach((tag) => {
          tag = tag.name
          if (count.hasOwnProperty(tag)) {
            count[tag] += 1;
          } else {
            count[tag] = 1;
          }
        });
      });
      this.setState({ tagCounts: count });

    })
  }

  render() {
    const { tagCounts } = this.state;
    const { onPageChange, tagName, user } = this.props;
    // console.log(user)
    function searchTag(tag){
      
      tagName.current = `[${tag}]`
      onPageChange("questionPage")
    }
    return (
      <div className="tagsPage" id="tagsPage">
        <div className="topBar">
          <h1 className="nTags" id="nTags">
            {Object.keys(tagCounts).length} Tags
          </h1>
          <h1 className="allTags">All Tags</h1>
          {user.current ? 
          <button className="ask_button" onClick={() => onPageChange("questionForm")}>
            Ask Question
          </button> : <p></p>
  }
        </div>
        <div className="tagContainer" id="tagContainer">
          {Object.keys(tagCounts).map((tag, index) => (
            <div className="box" key={index}>
              <button className='tagButton' onClick={() => searchTag(tag)}>{tag}</button>
              <div>{tagCounts[tag]} question{tagCounts[tag] === 1 ? '' : 's'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TagPage;

