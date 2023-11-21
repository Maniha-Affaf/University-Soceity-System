const EventModel = require("../models/Event");
const UserModel = require("../models/User");

const getEvents = async (req, res) => {
  await EventModel.find({}, (err, doc) => {
    if (err) {
      res.send(err + " 🦓!");
    }
    console.log("Events Sent Your Way 🤩!");
    res.send(doc);
  }).clone();
};

const addEvent = async (req, res) => {
  const by = req.body.by;
  const topic = req.body.topic;
  const description = req.body.description;
  const stime = req.body.stime;
  const etime = req.body.etime;
  const status = false;
  const user = await UserModel.findOne({ userMail: req.body.by });
  //   console.log(user);

  console.log("User Role:", user.userRole);
  if (user.userRole !== "President" && user.userRole!=="Departmental Head") {
    console.log("Not authorized!");
    return res
      .status(200)
      .send({ message: "You are not authorized to create Event!" });
  }



//   if (user.userRole == "Team Member") {
//     return res
//       .status(200)
//       .send({ message: "You are not authorized to create Event!" });
//   }
  
  const event = new EventModel({
    by: by,
    topic: topic,
    description: description,
    stime: stime,
    etime: etime,
    status: status,
  });

  await event.save((err, doc) => {
    if (err) {
      console.log(err + " 😌!");
      return res.status(409).send({ message: err.message });
    } else {
      console.log("New Event Created 🎃!");
      return res.status(200).send({ message: "New Event Created!" });
    }
  });
};

const updateEvent = async (req, res) => {
  await EventModel.updateOne(
    { _id: req.body.id },
    { status: !req.body.status },
    (err, doc) => {
      if (err) {
        return console.log(err + " 🤐!");
      }
      console.log("Event completed Woohoo 🎆!");
    }
  ).clone();
};

module.exports = {
  getEvents,
  addEvent,
  updateEvent,
};
