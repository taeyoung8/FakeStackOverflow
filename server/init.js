// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
const Question = require('./models/questions');
const Tag = require('./models/tags');
const Answer = require('./models/answers');
const User = require('./models/users');


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';


let credentials = process.argv.slice(2); //will be a list of 2 args (email + password)



if(credentials.length!=2){
  console.log("Credenials for admin account must be supplied as node .\\init.js <email> <password>")
}else{
  //How to connect
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //connect the db
  const db = mongoose.connection;
  //binds
  db.on('error', console.error.bind(console, 'Failed to connect to MongoDB'));
  db.once('open', function() {
    console.log('Connected to Mongo');
    
    setAdmin(credentials[0], credentials[1])
    .then(() => {
      console.log("Completed Setup")
      db.close();
    })
    .catch((error) => {
      console.error('Error:', error);
      db.close();
    });
    
  });
}



async function setAdmin(email,password){
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email: email,
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
    
      await newUser.save();
    
      console.log(`Completed user: ${email}`)

      var user1 = await setUser("nick@gmail.com","nick","pw",150) //medium rep user
      var user2 = await setUser("taeyoung@gmail.com","taeyoung","password",250) //high rep user
      var user3 = await setUser("user@gmail.com","user","test",0) //no rep user (new user)
      await setUser("user2@gmail.com","user2","pw",45) //just below threshhold user
      await setUser("user3@gmail.com","user","pw",-5) // negative rep user
      var tag1 = await new Tag({name:"tag1"}).save()
      var tag2 = await new Tag({name:"tag2"}).save()
      var tag3 = await new Tag({name:"tag3"}).save()
      var tag4 = await new Tag({name:"tag4"}).save()

      var q1 = await questionCreate("This is a test question title", "This is a summary for test question", "This is the text for a summary",[tag1,tag2,tag3], user1)//title, summary, text, tags, asked_by
      var q2 = await questionCreate("JavaScript asynchronous operations?", "I'm curious about the inner workings of async in JS.", "I've been reading about promises and async/await, but I want a deeper understanding.", [tag1, tag2], user2);
      var q3 = await questionCreate("Beginner's guide to HTML", "I'm new to web development. Can someone provide a simple guide to HTML?", "I've just started learning web development, and HTML is a bit confusing.", [tag3], user3);
      var q4 = await questionCreate("Learning advanced CSS techniques", "Looking for tips and tricks beyond the basics of CSS.", "I want to enhance my CSS skills and create more complex layouts.", [tag4], user2);
      var q5 = await questionCreate("Dealing with negative reputation", "Any suggestions on how to improve my reputation?", "I've received negative feedback, and I'm not sure how to address it.", [tag1, tag4], user1);

      //text, ans_by ,qid
      //q1 answer
      await answerCreate("This is a test answer to the test question with a [hyperlink to google](https://google.com).", user1, q1._id);
      //q2 answer
      await answerCreate("JavaScript handles asynchronous operations using the event loop.", user3, q2._id);
      //q3 answer
      await answerCreate("Sure, here's a simple guide to HTML:\n1. HTML is a markup language used for creating web pages...\n", user2, q3._id);
      //q4 answer
      await answerCreate("To learn advanced CSS techniques, you can focus on flexbox, grid layout, and CSS animations.", user1, q4._id);
      //leave q5 unanswered

}

async function setUser(email,username,password,rep){
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email: email,
        username: username,
        password: hashedPassword,
        isAdmin: false,
        reputation: rep
      });
    
      await newUser.save();
      console.log(`Completed user: ${email}`)
      return newUser
      
}


async function answerCreate(text, ans_by,qid) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  const question = await Question.findById(qid)
  if(question) answerdetail.question = question._id;
  let answer = new Answer(answerdetail);
  var ans = await answer.save();

  ans_by.answers.push(ans._id);

    // Save the updated user
    await ans_by.save();

    await Question.findByIdAndUpdate(
      qid,
      { $push: { answers: ans } },
      { new: true }
    )

    console.log("Inserted Answer")
    return answer;
}

async function questionCreate(title, summary, text, tags, asked_by) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    asked_by: asked_by,
  }

  let qstn = new Question(qstndetail);
  
    
  var ques = await qstn.save();
  asked_by.questions.push(ques._id);

  for (let i = 0; i < tags.length; i++) {
    const currTag = tags[i];
    currTag.questions.push(ques._id)
    await currTag.save()
  }

    // Save the updated user
    await asked_by.save();
    console.log("Inserted Question")
    return ques

}