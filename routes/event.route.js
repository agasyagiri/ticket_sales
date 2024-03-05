/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load event's controller */
const eventController = require(`../controllers/event.controller`)

/** load function from user-validation */
const { validateEvent } = require("../middlewares/event-validation")

/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsUser, IsAdmin} = require('../middlewares/role-validation')

/** create route to get data with method "GET" */
app.get("/",authorize, eventController.getAllEvent)

/** create route to find event
 * using method "GET" and define parameter key for "keyword" */
app.get("/:key",authorize, eventController.findEvent)

/** create route to add new event using method "POST" */
app.post("/",authorize, IsAdmin, eventController.addEvent)

/** create route to update event 
 * using method "PUT" and define parameter for "id" */
app.put("/:id",authorize, IsAdmin, eventController.updateEvent)

/** create route to delete event 
 * using method "DELETE" and define parameter for "id" */
app.delete("/:id",authorize, IsAdmin, eventController.deleteEvent)

/** export app in order to load in another file */
module.exports = app
