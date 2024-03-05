/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load user's controller */
const userController = require(`../controllers/user.controller`)

/** load function from user-validation */
const { validateUser } = require("../middlewares/user-validation")

/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsUser, IsAdmin} = require('../middlewares/role-validation')

/** create route to get data with method "GET" */
app.get("/", authorize, IsAdmin, userController.getAllUser)

/** create route to find user
 * using method "GET" and define parameter "key" for keyword */
app.get("/:key", authorize, IsAdmin, userController.findUser)

/** create route to add new user using method "POST" */
app.post("/", authorize, IsAdmin, validateUser, userController.addUser)

/** create route to update user 
 * using method "PUT" and define parameter for "id" */
app.put("/:id", authorize, validateUser, userController.updateUser)

/** create route to delete user 
 * using method "DELETE" and define parameter for "id" */
app.delete("/:id", authorize, IsAdmin, userController.deleteUser)

/** create route to add new user using method "POST" */
app.post("/register", validateUser, userController.register)

/** create route to reset password user 
 * using method "PUT" and define parameter for "id" */
app.put("/reset/:id", userController.resetPassword)

/** export app in order to load in another file */
module.exports = app
