const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      require: true,
      trim: true,
    },
    userId: {
      type: objId,
      ref: "user",
      require: true,
    },
    ISBN: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      require: true,
      trim: true,
    },
    subcategory: {
      type: String,
      require: true,
      trim: true,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    deletedAt: { type: Date, default: null },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
      require: true,
    },
    bookCover:{
      type:String,
      require:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("book", bookSchema);




