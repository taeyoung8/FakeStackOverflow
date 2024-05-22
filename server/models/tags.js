// Tag Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
      type: String,
    },
    questions: [{ //questions this tag is associated with
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
  });

tagSchema.virtual('url').get(function() {
    return '/tags/' + this._id;
  });

const Tag = mongoose.model('Tag', tagSchema);


module.exports = Tag;

