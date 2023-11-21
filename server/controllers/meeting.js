const MeetingModel = require("../models/Meeting");
const UserModel = require("../models/User");

const getMeetings = async (req, res) => {
  await MeetingModel.find({}, (err, doc) => {
    if (err) {
      res.send(err + " 🦓!");
    }
    console.log("Meetings Sent Your Way 🤩!");
    res.send(doc);
  }).clone();
};

const addMeeting = async (req, res) => {
  const by = req.body.by;
  const topic = req.body.topic;
  const description = req.body.description;
  const stime = req.body.stime;
  const etime = req.body.etime;
  const status = false;
  const user = await UserModel.findOne({ userMail: req.body.by });
  //   console.log(user);
  if (user.userRole == "Team Member") {
    return res
      .status(200)
      .send({ message: "You are not authorized to create meeting!" });
  }
  const meet = new MeetingModel({
    by: by,
    topic: topic,
    description: description,
    stime: stime,
    etime: etime,
    status: status,
  });

  await meet.save((err, doc) => {
    if (err) {
      console.log(err + " 😌!");
      return res.status(409).send({ message: err.message });
    } else {
      console.log("New Meeting Created 🎃!");
      return res.status(200).send({ message: "New Meeting Created!" });
    }
  });
};

const updateMeeting = async (req, res) => {
  await MeetingModel.updateOne(
    { _id: req.body.id },
    { status: !req.body.status },
    (err, doc) => {
      if (err) {
        return console.log(err + " 🤐!");
      }
      console.log("Meeting completed Woohoo 🎆!");
    }
  ).clone();
};

module.exports = {
  getMeetings,
  addMeeting,
  updateMeeting,
};
