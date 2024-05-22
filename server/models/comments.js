// Comment Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  commented_by: { //should change this from string to ObjectID with ref of User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment_date_time: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: [Number],
    default: [0, 0]

  },
  answerID:{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null
  },
  questionID:{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null
  },

});

commentSchema.virtual('url').get(function() {
    return '/comments/' + this._id;
  });

const Comment = mongoose.model('Comment', commentSchema);


module.exports = Comment;

