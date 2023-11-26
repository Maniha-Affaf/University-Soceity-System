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
  const status = req.body.status;
  const meetType=req.body.meetType;
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
    meetType:meetType,
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

// const updateMeeting = async (req, res) => {
//   await MeetingModel.updateOne(
//     { _id: req.body.id },
//     { status: !req.body.status },
//     (err, doc) => {
//       if (err) {
//         return console.log(err + " 🤐!");
//       }
//       console.log("Meeting completed Woohoo 🎆!");
//       return res.status(200).send({ message: "Meeting completed Woohoo 🎆!" });
//     }
//   ).clone();
// };

// const updateMeeting = async (req, res) => {
//   const { id, status, Topic, Description, MeetType, Starttime, endtime } = req.body;

//   try {
//     const result = await MeetingModel.updateOne(
//       { _id: id },
//       {
//         $set: {
//           status: status,
//           topic: Topic,
//           description: Description,
//           meetType: MeetType,
//           starttime: Starttime,
//           endtime: endtime
//         }
//       }
//     );

//     if (result.nModified > 0) {
//       console.log("Meeting edited Woohoo 🎆!");
//       return res.status(200).send({ message: "Meeting edited Woohoo 🎆!" });
//     } else {
//       console.log("Meeting not found or no modifications.");
//       return res.status(404).send({ message: "Meeting not found or no modifications." });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ message: "Internal Server Error" });
//   }
// };


const updateMeeting = async (req, res) => {
  const id = req.body.id;
  const by = req.body.by;
  const topic = req.body.topic;
  const description = req.body.description;
  const stime = req.body.stime;
  const etime = req.body.etime;
  const status = req.body.status;
  const meetType = req.body.meetType;

   await MeetingModel.updateOne(
      { _id: req.body.id },
      { data:{meetType,status,etime,stime,description,topic,by}},
      (err, doc) => {
        if (err) {
          return console.log(err + " 🤐!");
        }
        console.log("Meeting completed Woohoo 🎆!");
        return res.status(200).send({ message: "Meeting completed Woohoo 🎆!" });
      }
    ).clone();

};



module.exports = {
  getMeetings,
  addMeeting,
  updateMeeting,

};
