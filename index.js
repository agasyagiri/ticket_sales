/** load library express */
const express = require(`express`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 3000

/** load library cors */
const cors = require(`cors`)

/** open CORS policy */
app.use(cors())

/** define all routes */
const userRoute = require(`./routes/user.route`)
const eventRoute = require(`./routes/event.route`)
const ticketRoute = require(`./routes/ticket.route`)
const auth = require(`./routes/auth.route`)

/** define prefix for each route */
app.use(`/user`, userRoute)
app.use(`/event`, eventRoute)
app.use(`/ticket`, ticketRoute)
app.use(`/auth`, auth)

/** route to access uploaded file */
app.use(express.static(__dirname))

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})
