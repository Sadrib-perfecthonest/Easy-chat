const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
  },
  members: [
    {
      name: String,
      avatar: String,
    },
  ],
  interest: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Community", CommunitySchema);
