// Question Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    title: {
      type: String,
      required: true,
      maxlength: 50
    },
    summary: {
      type: String,
      required: true, // need to be true after implementing summary
      maxlength: 140
    },
    text: {
      type: String,
      required: true
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],

    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    asked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ask_date_time: {
      type: Date,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    },
    //

    votes: {
      type: [Number],
      default: [0, 0]

    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }]

  });

  questionSchema.virtual('url').get(function() {
    return '/questions/' + this._id;
  });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
