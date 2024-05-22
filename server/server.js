// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

// import Question from './models/questions.js';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require("express-session");

// import Question from './models/questions.js';
// import Tag from './models/tags.js';
// import Answer from './models/answers.js';

const Question = require('./models/questions');
const Tag = require('./models/tags');
const Answer = require('./models/answers');
const User = require('./models/users');
const Comment = require('./models/comments');

const bcrypt = require('bcrypt');
const saltRounds = 10;




const app = express();
// app.use(cors())
app.use(express.json())
const port = 8000;


let userArgs = process.argv.slice(2);

app.use(
  session({
    secret: userArgs, //We need to use sysargv[2] or something like that instead
    cookie: {},
    resave: false,
    saveUninitialized: false
  })
);


const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));



const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';

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
});





async function deleteCommentIndividual(comment) { //the other one deletes comment knowning the whole post will be deleted, this one only cares ab the parent element
  try {
    // Find the user by username
    const user = await User.findById(comment.commented_by);
    // console.log(comment)
    if (!user) {
      console.log('User not found');
      return;
    }
    if(comment.answerID!=null){
      const ans = await Answer.findById(comment.answerID)
      ans.comments.pull(comment._id)
      await ans.save()

    }else{
      const quest = await Question.findById(comment.questionID)
      quest.comments.pull(comment._id)
      await quest.save()

    }

    if (!user) {
      console.log('User not found');
      return;
    }

    // Remove the comment ID from the user's comments array
    user.comments.pull(comment._id);
    await user.save();

    // Delete the comment
    await Comment.findByIdAndDelete(comment._id);


    console.log('Comment deleted successfully');
  } catch (error) {
    console.error(error);
  }
}



async function deleteAnswer(answerId){
 let deletedAnswer = await Answer.findById(answerId).populate('comments').populate('ans_by');
 if(!deletedAnswer){
  console.log("Ans not found",answerId)
  return
 }
 deletedAnswer.comments.forEach(async (comment) => {
    await deleteCommentIndividual(comment)
  });


  // await User.updateOne(
  //   { email: deletedAnswer.ans_by.email },
  //   { $pull: { answers: deletedAnswer._id }, $inc: { reputation: (-deletedAnswer.votes[1]*5) } }
  // );

  await User.updateOne(
    { email: deletedAnswer.ans_by.email },
    { $pull: { answers: deletedAnswer._id }}
  );

  await Answer.findByIdAndDelete(deletedAnswer._id);

}

async function deleteQuestion(questionId){
  const deletedQuestion = await Question.findById(questionId).populate('comments').populate('answers').populate('asked_by');
  if (!deletedQuestion) {
    console.error(err);
    return;
  }

    //** WE SHOULD ALSO BE DELETING TAGS HERE BUT IDK HOW HE WANTS US TO HANDLE IT **//
    deletedQuestion.answers.forEach(async (answer) => {
     await deleteAnswer(answer._id)

    });
    deletedQuestion.comments.forEach(async (comment) => {
      await deleteCommentIndividual(comment)
    });


  // If the answer was deleted successfully, update the user's answers array
    const user = await User.findById(deletedQuestion.asked_by)
    // user.reputation -= (deletedQuestion.votes[1]*5); //restore reputation
    user.questions.pull(deletedQuestion._id);
    await user.save()
    await Question.findByIdAndDelete(deletedQuestion._id);
}



function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

async function tagCanDelete(name,userID){
  let tag = await Tag.findOne({name:name}).populate("questions")
  if(tag == undefined){
    console.log("Tag not found")
    return false;
  }

  console.log(tag,tag.questions)
  for (let i = 0; i < tag.questions.length; i++) {
    const question = tag.questions[i];
    console.log(question.asked_by.toString() , userID.toString())
    console.log(question.asked_by.toString() != userID.toString())
    if(question.asked_by.toString() != userID.toString()){
      return false;

    }

    }    

  
  return true
}


async function tagDelete(name){
  let tag = await Tag.findOne({name:name}).populate("questions")
  for (let i = 0; i < tag.questions.length; i++) {
    const question = tag.questions[i];
    await Question.updateOne(
      { _id: question._id },
      { $pull: { tags: tag._id } }
    );

  }
  await Tag.findByIdAndDelete(tag._id);


} 

async function modifyAllTags(tagName, newTagName) {
  try {
    const tag = await Tag.findOne({ name: tagName }).populate("questions");
    const newTag = await Tag.findOne({ name: newTagName }).populate("questions");

    if (!newTag) {
      tag.name = newTagName;
      await tag.save();
      return true;
    }
    await Promise.all(
      tag.questions.map(async (question) => {
        question.tags = question.tags.map((currTag) =>
          currTag.toString() == tag._id.toString() ? newTag._id : currTag
        );
        await question.save();
      })
    );


    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}






async function answerCreate(text, ans_by, ans_date_time,qid) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  const question = await Question.findById(qid)
  if(question) answerdetail.question = question._id;
  let answer = new Answer(answerdetail);
  await answer.save();
  return answer;
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, comments) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    asked_by: asked_by,
    comments: comments
  }
  // if (answers != false) qstndetail.answers = answers;
  // if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  // if (views != false) qstndetail.views = views;
  let qstn = new Question(qstndetail);
  return qstn.save();

}

//POST endpoints
app.post('/questions/modifyQuestion', async (req, res) => {
  console.log('Modifying:');
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var { title, summary, text, tags,qid } = req.body;
    var t = [];
        var user = (await User.findById(req.session.user.id))
        //Verify the question is the users
        if(!user.questions.includes(qid) && !user.isAdmin){
          return res.status(500).json({ error: 'User Did Not Ask Question' });
        }

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i].toLowerCase();
      var current = await tagFind(tag);
      if (current === undefined) {
        current = await tagCreate(tag);
      }
      t.push(current);
    }


    const ques = await Question.findById(qid)//req.session.user will be username, we can use ID instead
    if(!ques){
      return res.status(500).json({ error: 'Error' });

    }

    ques.title = title
    ques.summary = summary
    ques.text = text
    ques.tags = t


    // Save the question
    await ques.save();

    res.status(201).json({ message: 'Question Successfully Modified' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/tags/modifyTag', async (req, res) => {
  console.log('Modifying Tag:');
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var {tagName, email,newTagName} = req.body;
    let user = await User.findById(req.session.user.id)
    if(user.isAdmin){
      user = await User.findOne({email: email})
    }

    const canDelete = await tagCanDelete(tagName,user._id)
    if(canDelete){
      console.log("Modd")
      await modifyAllTags(tagName, newTagName)
    }else{
      return res.status(500).json({ error: 'Tag in use' });
    }



    res.status(201).json({ message: 'Tag Successfully Modified' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/tags/deleteTag', async (req, res) => {
  console.log('Deleting Tag:');
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var {tagName, email} = req.body;
    // console.log());
    let user = await User.findById(req.session.user.id)
    if(user.isAdmin){
      user = await User.findOne({email: email})
    }

    const canDelete = await tagCanDelete(tagName,user._id)
    if(canDelete){
      await tagDelete(tagName)
    }else{
      return res.status(500).json({ error: 'Tag in use' });
    }


    res.status(201).json({ message: 'Tag Successfully Deleted' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Logged out');
    }
  });
});


app.post('/questions/deleteQuestion', async (req, res) => {
  console.log('Deleting Question:');
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var {qid } = req.body;
    var t = [];
        var user = (await User.findById(req.session.user.id))
        //Verify the question is the users
        if(!user.questions.includes(qid) && !user.isAdmin){
          return res.status(500).json({ error: 'User Did Not Ask Question' });
        }

    await deleteQuestion(qid)

    res.status(201).json({ message: 'Question created modified' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/answers/deleteAnswer', async (req, res) => {
  console.log('Deleting Answer:',req.body);
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var {aid } = req.body;
    var t = [];
        var user = (await User.findById(req.session.user.id))
        //Verify the question is the users
        if(!user.answers.includes(aid) && !user.isAdmin){
          return res.status(500).json({ error: 'User Did Not Ask Question' });
        }

        await deleteAnswer(aid)

    res.status(201).json({ message: 'Answer Successfully Deleted' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/questions/addComment/:id', async (req, res) => {

  if(!req.session.user){ //if they dont have a session basically
    //throw an error here
    return res.status(500).json({ error: 'Not Logged In' });
  }
  try {
    const {text } = req.body
    let comment = new Comment()
    comment.text = text;
    comment.comment_date_time = new Date()
    var user = (await User.findById(req.session.user.id))
    if(!user){
      return res.status(500).json({ error: 'User Not Found' });
    }
    comment.commented_by = user; //check before to make sure it isnt undefined
    // console.log(comment)
    await comment.save(); //save comment to comment db
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    )
    .populate({
      path: 'answers',
      populate: [
        { path: 'comments', populate: { path: 'commented_by' } },
        { path: 'ans_by' }
      ]
    })
    .populate('tags')
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('asked_by');

    comment.questionID = updatedQuestion._id
    await comment.save()

    user.comments.push(comment._id)
    await user.save()

    //WE ALSO NEED TO ADD A COMMENTS, ANSWERS AND QUESTIONS TO USER SCHEMA TO KEEP TRACK OF THEIR OWN ONES AND INSERT HERE AND EVERYWHERE WE CREATE QUESTIONS/ANS/COMMENTS
    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.get('/answers/getAnswer/:id', async (req, res) => {
  // console.log(req.session)
  // res.status(200).json({ user: 'Hello'});
  if (req.session.user) {
    const answer = await Answer.findById(req.params.id)
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('ans_by')
    res.status(200).json(answer);
  } else {
    //No Auth
    res.status(401).json({});
  }
});

app.post('/answers/addComment/:id', async (req, res) => {
  if(!req.session.user){ //if they dont have a session basically
    //throw an error here
    return res.status(500).json({ error: 'Not Logged In' });
  }
  try {
    const {text } = req.body
    let comment = new Comment()
    comment.text = text;
    comment.comment_date_time = new Date()
    var user = (await User.findById(req.session.user.id)) //this will be the object ID of the person, if you want we can just use their username but then we need to search
    comment.commented_by = user; //check before to make sure it isnt undefined
    await comment.save();
  const updatedAnswer = await Answer.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: comment } },
    { new: true }
  )
  .populate({
    path: 'comments',
    populate: { path: 'commented_by' }
  })
  .populate('ans_by');

  comment.answerID = updatedAnswer._id;

  await comment.save();

    user.comments.push(comment._id)
    await user.save()


    //WE ALSO NEED TO ADD A COMMENTS, ANSWERS AND QUESTIONS TO USER SCHEMA TO KEEP TRACK OF THEIR OWN ONES AND INSERT HERE AND EVERYWHERE WE CREATE QUESTIONS/ANS/COMMENTS

    res.status(201).json(updatedAnswer);
  } catch (error) {
    console.error('Error creating question:', error);

    res.status(500).json({ error: 'Error' });
  }
});


app.post('/answers/modifyAnswer', async (req, res) => {
  console.log('Modifying Answer:');
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  // console.log('Curr Session:', req.session);

  try {
    var {text,aid } = req.body;
        var user = (await User.findById(req.session.user.id))
        //Verify the question is the users
        if(!user.answers.includes(aid) && !user.isAdmin){
          return res.status(500).json({ error: 'User Did Not Answer Question' });
        }




    const ans = await Answer.findById(aid)
    if(!ans){
      return res.status(500).json({ error: 'Error' });

    }

    ans.text = text


    // Save the question
    await ans.save();

    res.status(201).json({ message: 'Question Successfully Modified' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});





app.get('/users/questions/:email', async (req, res) => { //we are currently searching every question, we instead should get from the User.comments when implemented
  // console.log("user: ",req.session.user)
  if(!req.session.user){ //if they dont have a session basically
    //throw an error here
    return res.status(500).json({ error: 'Not Logged In' });
  }
  try {
    var user = (await User.findById(req.session.user.id))
    if(user.isAdmin){
      user = (await User.findOne({email: req.params.email}))
    }
    // await user.questions.populate("questions") //can do this way too somehow but idrc
    // console.log("user: ",user)
    // console.log("quest: ",questions)
    //finds all questions
    const questions = await Question.find({asked_by:user._id}) //can prob remove populate 'answers' and 'comments'
    .populate({
      path: 'answers',
      populate: [
        { path: 'comments', populate: { path: 'commented_by' } },
        { path: 'ans_by' }
      ]
    })
    .populate('tags')
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('asked_by');
    // console.log(questions)
    res.json(questions);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server Error' });
  }
});




app.post('/user/DeleteUser', async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const { uid } = req.body;
    const admin = await User.findById(req.session.user.id);
    // console.log()
    if (!admin) {
      return res.status(404).json({ error: 'Admin User not found' });
    }
    if (!admin.isAdmin) {
      return res.status(404).json({ error: 'Insufficient Privileges' });
    }

    const user = await User.findById(uid).populate('comments').populate('answers').populate('questions');

    if(!user){
      return res.status(404).json({ error: 'Targeted User not found' });
    }

    console.log(user)
    console.log(user.comments)
    for (const comment of user.comments) {
      await deleteCommentIndividual(comment);
    }


    for (const answer of user.answers) {
      await deleteAnswer(answer);
    }

    for (const question of user.questions) {
      await deleteQuestion(question);
    }



    await User.findByIdAndDelete(user._id);

    var allUsers = (await User.find())
    // .filter(user => !user.isAdmin)
    res.status(201).json({allUsers});

  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: error });
  }
});



app.get('/users/answers/:email', async (req, res) => { //we also should get from users.answers when implemented (SHOULD WE ADD question field to answer schema showing where it came from?)
  // console.log("user: ",req.session.user)
  if(!req.session.user){ //if they dont have a session basically
    //throw an error here
    return res.status(500).json({ error: 'Not Logged In' });
  }
  try {
    var user = (await User.findById(req.session.user.id));

    if(user.isAdmin){
      user = (await User.findOne({email:req.params.email}));
    }
    if(!user){ //if they dont have a session basically
      //throw an error here
      return res.status(500).json({ error: 'User Not Found' });
    }

    const answerIds = user.answers;
    const allQuestions = answerIds != undefined ? await Promise.all(
      answerIds.map(async (answerId) => {
        const answer = await Answer.findById(answerId);
        if (!answer) {
          return null;
        }

        return await Question.findById(answer.question)
        .populate('comments')
        .populate({
          path: 'answers',
          populate: [
            { path: 'comments', populate: { path: 'commented_by' } },
            { path: 'ans_by' }
          ]
        })
        .populate('tags').populate('asked_by');
      })
    ): [];

    const uniqueAnsSet = new Set();
  const uniqueAns = allQuestions.filter(ques => {
    const key = ques._id.toString();
    if (uniqueAnsSet.has(key)) {
      return false;
    }
    uniqueAnsSet.add(key);
    return true;
  });




    res.json(Object.values(uniqueAns));



  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server Error' });
  }
});



function validEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}




app.post('/register', async (req, res) => {
  const { email, username, password, admin } = req.body; //admin should not be allowed on register

  //remove whitespace of email, username, password
  const trimmedEmail = email.trim();
  const trimmedUsername = username.trim();
  let errors = [];

  // Verify Email Format
  if (!validEmail(email)) {
    errors.push('Invalid email format');
  }

  // Verify existing email and username
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    errors.push('Email already taken');
  }
  // const existingUsername = await User.findOne({ username });
  // if (existingUsername) {
  //   errors.push('Username already taken');
  // }
  // console.log(trimmedEmail.split('@')[0],password)
  if (trimmedEmail !== "" && password.includes(trimmedEmail.split('@')[0])) {
    errors.push('Password should not contain email or username');
    console.log('Password should not contain email')
  }
  if (trimmedUsername !== "" && password.includes(trimmedUsername)) {
    errors.push('Password should not contain email or username');
    console.log('Password should not contain username')
  }
  if(password.includes(" ")) {
    errors.push('Password should not contain whitespaces');
   }
  // return the entire errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  // Save the user to the database with the hashed password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    email: trimmedEmail,
    username: trimmedUsername,
    password: hashedPassword,
    isAdmin: false
  });

  newUser.save();

  res.status(200).send('User registered successfully');
});


app.get('/authorize', (req, res) => {
  console.log(req.session)
  // res.status(200).json({ user: 'Hello'});
  if (req.session.user) {
    //Has Auth
    res.status(200).json({ user: req.session.user });
  } else {
    //No Auth
    res.status(401).json({});
  }
});

app.post('/login', async (req, res) => {


  const { email, password } = req.body;
  // console.log('Current Session:', req.session);
  const user = await User.findOne({ email });

  //We use same Invalid Username or Password since we dont want them to know which is wrong (can change if needed)
  if (!user) {
    console.log("Not found")
    return res.status(500).send('Invalid username or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if(!match){
    console.log("Not Match")
    return res.status(500).send('Invalid username or password');
  }
  // req.session.user = user.email
  // req.session.user = user.username
  const jsonInfo = {
    user: user.username,
    email: user.email,
    id:user._id,
    isAdmin:user.isAdmin,
    reputation: user.reputation,
    creation_date_time:user.creation_date_time
  }
  req.session.user = jsonInfo //sets req.session cookie to a json with all fields from user, can change if we want, every time the user is updated, we must update their cookie since objectID changes
  console.log('Session:', req.session);

  res.status(200).json({ user: req.session.user });
});



// app.get('/answers/getAnswers/:id', async (req, res) => {
//   try {
//     const answers = await Answer.find();
//     res.json(answers);
//   } catch (error) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

// app.get('/answers/getAnswers/:id', async (req, res) => {
//   try {
//     const answers = await Answer.find();
//     res.json(answers);
//   } catch (error) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// });


// GET endpoints
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find()
    .populate({
      path: 'answers',
      populate: [
        { path: 'comments', populate: { path: 'commented_by' } },
        { path: 'ans_by' }
      ]
    })
    .populate('tags')
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('asked_by');

    // console.log(questions)
    res.json(questions);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server Error' });
  }
});
app.get('/answers', async (req, res) => {
  try {
    const answers = await Answer.find();
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});
app.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});


async function tagFind(name){
  try {
    const tagName = name
    const tag = await Tag.findOne({ name: tagName });

    if (!tag) {
      return undefined;
    }

    return tag
  } catch (error) {
    console.error('Error fetching tag by name:', error);
    return undefined;
  }
}


//POST endpoints
app.post('/questions/insertQuestion', async (req, res) => {
  console.log('Curr Session1:', req.session);
  if(!req.session.user){
    return res.status(500).json({ error: 'User Not Found' });
  }
  console.log('Curr Session:', req.session);

  try {
    var { title, summary, text, tags, answers, ask_date_time, views, votes, comments } = req.body;
    var t = [];

    var user = (await User.findById(req.session.user.id))
    // console.log("User: ",user)
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i].toLowerCase();
      var current = await tagFind(tag);
      const user = (await User.findById(req.session.user.id));
      // console.log("current user reputation: ",user.reputation)
      if (current === undefined && user.reputation < 50 && !user.isAdmin) {
        return res.status(401).json({ error: 'User Not Enough Rep' });
      }
      if (current === undefined) {
        current = await tagCreate(tag);

      }
      // current = await tagCreate(tag);
      t.push(current);
    }



    const ques = await questionCreate(title, summary, text, t, answers, user, ask_date_time, views, votes, comments); //req.session.user will be username, we can use ID instead

    for (let i = 0; i < t.length; i++) {
      const currTag = t[i];
      currTag.questions.push(ques._id)
      await currTag.save()
    }


    user.questions.push(ques._id);

    // Save the updated user
    await user.save();

    res.status(201).json({ message: 'Question created successfully' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








app.post('/answers/insertAnswer', async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const { qid, text, ans_date_time } = req.body;
    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const ans_by = user;

    // console.log(req.session.user.id)
    // console.log(req.session.user.id.username)


    const ans = await answerCreate(text, ans_by, ans_date_time,qid)

    user.answers.push(ans._id);

    // Save the updated user
    await user.save();

    const updatedQuestion = await Question.findByIdAndUpdate(
      qid,
      { $push: { answers: ans } },
      { new: true }
    ).populate({
      path: 'answers',
      populate: [
        { path: 'comments', populate: { path: 'commented_by' } },
        { path: 'ans_by' }
      ]
    })
    .populate('tags')
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('asked_by');




    if (!updatedQuestion) {
      //Its not found while searchintg
      return res.status(404).json({ error: 'Cant find answer' });
    }


    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.post('/questions/addView/:id', async (req, res) => {
  try {


    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate({
      path: 'answers',
      populate: [
        { path: 'comments', populate: { path: 'commented_by' } },
        { path: 'ans_by' }
      ]
    })
    .populate('tags')
    .populate({
      path: 'comments',
      populate: { path: 'commented_by' }
    })
    .populate('asked_by');

    if (!updatedQuestion) {
      //Its not found while searchintg
      return res.status(404).json({ error: 'Cant find question' });
    }


    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.get('/questions/votes', async (req, res) => {
  try {
    const questionsWithVotes = await Question.find({}, 'votes'); // Select only the votes field
    res.json(questionsWithVotes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});


app.get('/questions/getQuestion/:qid', async (req, res) => {
  try {
    const question = await Question.findById(req.params.qid); // Select only the votes field
    res.json(question);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});


app.post('/questions/upvote/:id', async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    // get current user info and check user's reputation
    const currentUser = await User.findById(req.session.user.id);
    // console.log("rep:", currentUser.reputation);

    // add reputation to postUser
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const postUser = await User.findById(question.asked_by);
    if (!postUser) {
      return res.status(404).json({ error: 'Posting user not found' });
    }
    // console.log("Poster", postUser.username);
    postUser.reputation += 5;
    await postUser.save();

    if (currentUser.reputation < 50 && !currentUser.isAdmin) {
      return res.status(403).json({ error: 'Insufficient reputation to upvote' });
    }
    const questionId = req.params.id;
    const updatedQuestion = await Question.findById(questionId);

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    updatedQuestion.votes[0] += 1;
    updatedQuestion.votes[1] += 1;

    await updatedQuestion.save();

    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Server Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});



app.post('/questions/downvote/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    // get current user info and check user's reputation
    const currentUser = await User.findById(req.session.user.id);

    // console.log(currentUser.reputation);
    if (currentUser.reputation < 50 && !currentUser.isAdmin) {
      return res.status(403).json({ error: 'Insufficient reputation to downvote' });
    }
    const questionId = req.params.id;
    const updatedQuestion = await Question.findById(questionId);

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    updatedQuestion.votes[0] += 1;
    updatedQuestion.votes[1] -= 1;
    await updatedQuestion.save();

    // add reputation to postUser
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const postUser = await User.findById(question.asked_by);
    if (!postUser) {
      return res.status(404).json({ error: 'Posting user not found' });
    }
    // console.log("Poster", postUser.username);
    postUser.reputation -= 10;
    await postUser.save();

    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Server Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/answers/votes', async (req, res) => {
  try {
    const answersWithVotes = await Answer.find({}, 'votes'); // Select only the votes field
    res.json(answersWithVotes);
  } catch (error) {

    res.status(500).send('Server Error');
  }
});



app.post('/answers/upvote/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    // get current user info and check user's reputation
    const currentUser = await User.findById(req.session.user.id);

    if (currentUser.reputation < 50 && !currentUser.isAdmin) {
      return res.status(403).json({ error: 'Insufficient reputation to upvote' });
    }
    const answerId = req.params.id;
    const updatedAnswer = await Answer.findById(answerId);

    if (!updatedAnswer) {
      return res.status(404).send('Answer not found');
    }

    updatedAnswer.votes[0] += 1;
    updatedAnswer.votes[1] += 1;

    await updatedAnswer.save();

    // add reputation to postUser
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    const postUser = await User.findById(answer.ans_by);
    if (!postUser) {
      return res.status(404).json({ error: 'Posting user not found' });
    }
    postUser.reputation += 5;
    await postUser.save();

    res.status(201).json(updatedAnswer);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/answers/downvote/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    // get current user info and check user's reputation
    const currentUser = await User.findById(req.session.user.id);

    if (currentUser.reputation < 50 && !currentUser.isAdmin) {
      return res.status(403).json({ error: 'Insufficient reputation to downvote' });
    }
    const answerId = req.params.id;
    const updatedAnswer = await Answer.findById(answerId);

    if (!updatedAnswer) {
      return res.status(404).send('Answer not found');
    }

    updatedAnswer.votes[0] += 1;
    updatedAnswer.votes[1] -= 1;

    await updatedAnswer.save();

    // add reputation to postUser
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    const postUser = await User.findById(answer.ans_by);
    if (!postUser) {
      return res.status(404).json({ error: 'Posting user not found' });
    }
    postUser.reputation -= 10;
    await postUser.save();

    res.status(201).json(updatedAnswer);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get('/comments/votes', async (req, res) => {
  try {
    const commentsWithVotes = await Comment.find({}, 'votes'); // Select only the votes field
    res.json(commentsWithVotes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/comments/upvote/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const commentId = req.params.id;

    const updatedComment = await Comment.findById(commentId);

    if (!updatedComment) {
      return res.status(404).send('Comment not found');
    }

    updatedComment.votes[0] += 1;
    updatedComment.votes[1] += 1;

    await updatedComment.save();

    res.status(201).json(updatedComment);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get('/user/info', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ username: user.username,email: user.email, reputation: user.reputation, isAdmin:user.isAdmin });
  } catch (error) {
    console.error('Server Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/user/info/:email', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(user.isAdmin){
      // console.log("admin")
      const diffUser = await User.findOne({email: req.params.email});
      if(diffUser){
        // console.log(diffUser)
        return res.json({ username: diffUser.username, reputation: diffUser.reputation, isAdmin:diffUser.isAdmin });
      }
    }
    res.json({ username: user.username, reputation: user.reputation, isAdmin:user.isAdmin });
  } catch (error) {
    console.error('Server Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/user/allUsers', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not Logged In' });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.isAdmin) {
      return res.status(404).json({ error: 'Insufficient Privileges' });
    }
    var users = (await User.find())
    // .filter(user => !user.isAdmin)
    res.status(200).json({users});
  } catch (error) {
    console.error('Server Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
