// User Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  email: {
    type: String,
    required: true
  },
    username: {
      type: String,
      required: true
    },
    password: {

      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean, //For having access to admin or not?
      required: true,
      default: false
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    reputation: {
      type: Number,
      required: true,
      default:0
    },
    creation_date_time: {
      type: Date,
      required: true,
      default:Date.now  
    }

  });

userSchema.virtual('url').get(function() {
    return '/users/' + this._id;
  });

const User = mongoose.model('User', userSchema);


module.exports = User;
