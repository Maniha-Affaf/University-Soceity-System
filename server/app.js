require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connection = require("./config/db");
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");
const meetingRoutes = require("./routes/meeting");
const eventRoutes =require("./routes/event")
const sandcRoutes = require("./routes/sandc");
const notificationRoutes = require("./routes/notification");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
connection();

app.use("/", userRoutes);
app.use("/todo", todoRoutes);
app.use("/meet", meetingRoutes);
app.use("/event", eventRoutes);
app.use("/sandc", sandcRoutes);
app.use("/notification", notificationRoutes);

app.listen(port, () => console.log(`App Listening on port ${port} 🚄!`));
