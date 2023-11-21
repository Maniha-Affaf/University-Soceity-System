const express = require('express')
const eventController = require('../controllers/event')

const router = express.Router()


router.post("/addevent", eventController.addEvent)

router.get("/getevents", eventController.getEvents)

router.put("/updateevent", eventController.updateEvent)


module.exports = router