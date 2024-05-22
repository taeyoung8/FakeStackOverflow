// Answer Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: {
    type: String,
    required: true
  },

  ans_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  votes: {
    type: [Number],
    default: [0, 0] //total, rating

  },
  ans_date_time: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }]
});

answerSchema.virtual('url').get(function() {
    return '/answers/' + this._id;
  });

const Answer = mongoose.model('Answer', answerSchema);


module.exports = Answer;

