/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load ticket's controller */
const ticketController = require(`../controllers/ticket.controller`)

/** load function from user-validation */
const { validateTicket } = require("../middlewares/ticket-validation")

/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsUser, IsAdmin} = require('../middlewares/role-validation')


app.get("/ticketSales",ticketController.ticketSales)

app.get("/top5Events",ticketController.top5Events)

/** create route to add new ticket using method "POST" */
app.post("/", ticketController.addTicket)

/** create route to get data with method "GET" */
app.get("/",authorize, IsAdmin, ticketController.getAllTicket)

/** create route to get data by id with method "GET" */
app.get("/:id",authorize, IsAdmin, ticketController.ticketByID)

app.put("/userTickets",ticketController.userTickets)

/** export app in order to load in another file */
module.exports = app
