const mongoose = require('mongoose');
const objId =  mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({

  bookId: {
    type: objId,
    require: true,
    ref: "book",
  },
  reviewedBy: {
    type: String,
    require: true,
    default: "Guest",
  },
    reviewedAt : {
        type : Date,
        require : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        require : true
    },
    review : String,
    isDeleted : {
        type : Boolean,
        default : false
    }
  },{timestamps:true}
);

module.exports = mongoose.model("review", reviewSchema);
