/** load model */
const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket
const md5 = require(`md5`)

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("ticket", "root", "", {
    host: "localhost",
    dialect: "mysql",
})


/** create function for add new ticket */
exports.addTicket = async (request, response) => {
    /** prepare date for bookedDate */
    const today = new Date()
    const bookedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

    /** prepare data from request */
    const { eventID, userID, seats } = request.body;


    try {
        // Create seat records for the chosen seats
        const seatIDs = await Promise.all(seats.map(async seat => {
            const { rowNum, seatNum } = seat;
            const createdSeat = await seatModel.create({
                eventID,
                rowNum,
                seatNum,
                status: 'true'
            });
            console.log("cek ", createdSeat)
            return createdSeat.seatID;
        }));

        // Create ticket records associating the chosen seats
        const tickets = await ticketModel.bulkCreate(seatIDs.map(seatID => ({
            eventID,
            userID,
            seatID,
            bookedDate
        })));

        console.log("cek tiket: ", tickets)

        response.status(201).json(tickets);
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** create function for read all data */
exports.getAllTicket = async (request, response) => {
    /** call findAll() to get all data */
    let tickets = await ticketModel.findAll(
        {
            include: [
                { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
                { model: userModel, attributes: ['firstName', 'lastName'] },
                { model: seatModel, attributes: ['rowNum', 'seatNum'] },
            ]
        }
    )
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })

    // const result = await sequelize.query(
    //     "SELECT tickets.id,tickets.eventID,tickets.userID,tickets.seatID,events.eventName From tickets JOIN events ON events.id = tickets.eventID "
    // );
    // if(result[0].length === 0){
    //     return response.status(400).json({
    //         success: false,
    //         message: "adasd"
    //     })
    // }
    // response.json({
    //     success: true,
    //     data: result[0]
    // })
}

/** create function for filter ticket by ID */
exports.ticketByID = async (request, response) => {
    /** define ticketID to find data */
    let ticketID = request.params.id

    /** call findAll() within where clause and operation 
     * to find data based on ticketID  */
    let tickets = await ticketModel.findAll({
        where: {
            ticketID: { [Op.eq]: ticketID }
        },
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
            { model: userModel, attributes: ['firstName', 'lastName', 'email'] },
            { model: seatModel, attributes: ['rowNum', 'seatNum'] },
        ]
    })
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })
}


// exports.userTickets = async (request, response) => {
//     const { email, password } = request.body;

//     if (!email || !password) {
//         return response.json({
//             success: false,
//             message: "Email and password are required."
//         });
//     }

//     userModel.findOne({ where: { email: email } })
//         .then(user => {
//             if (!user) {
//                 return response.json({
//                     success: false,
//                     message: "User not found."
//                 });
//             }

//             if (user.password === md5(password)) {
//                 ticketModel.findAll({
//                     where: { userID: user.userID },
//                     include: [
//                         { model: seatModel, attributes: ['rowNum', 'seatNum'] },
//                     ]
//                 })
//                     .then(tickets => {
//                         return response.json({
//                             success: true,
//                             user: {
//                                 id: user.id,
//                                 // data: soldTickets,
//                                 email: user.email,
//                                 tickets: tickets
//                             },
//                             message: "Successful."
//                         });
//                     })
//                     .catch(error => {
//                         return response.json({
//                             success: false,
//                             message: error.message
//                         });
//                     });
//             } else {
//                 return response.json({
//                     success: false,
//                     message: "Incorrect password."
//                 });
//             }
//         })
//         .catch(error => {
//             return response.json({
//                 success: false,
//                 message: error.message
//             });
//         });
// }

exports.userTickets = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.json({
            success: false,
            message: "Email and password are required.",
        });
    }

    try {
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
            return response.json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.password === md5(password)) {
            const totalTickets = await ticketModel.count({ where: { userID: user.userID } });

            const tickets = await ticketModel.findAll({
                where: { userID: user.userID },
                include: [{ model: seatModel, attributes: ['rowNum', 'seatNum'] }],
            });

            return response.json({
                success: true,
                user: {
                    id: user.userID,
                    email: user.email,
                    totalTickets:totalTickets,
                    tickets: tickets,
                },
                message: "Successful.",
            });
        } else {
            return response.json({
                success: false,
                message: "Incorrect password.",
            });
        }
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};


exports.ticketSales = async (request, response) => {
    try {
        const soldTickets = await ticketModel.findAll({
            attributes: [
                'eventId',
                [Sequelize.col('event.eventName'), 'eventName'],
                [Sequelize.fn('COUNT', 'id'), 'ticketsSold',],
            ],
            group: ['eventId'],
            include: [{ model: eventModel, attributes: [] }]

        });

        response.json({
            success: true,
            data: soldTickets,
            message: "Tickets sold per event retrieved successfully"
        });
    } catch (error) {
        response.json({
            success: false,
            message: error.message
        });
    }
};

exports.top5Events = async (request, response) => {
    try {
        const topEvents = await ticketModel.findAll({
            attributes: [
                'eventId',
                [Sequelize.fn('COUNT', 'id'), 'ticketsSold'],
                [Sequelize.col('event.eventName'), 'eventName'],
            ],
            group: ['eventId'],
            order: [[Sequelize.col('ticketsSold'), 'DESC']],
            include: [{
                model: eventModel,
                attributes: [],
            }],
            limit: 5,
        });

        response.json({
            success: true,
            data: topEvents,
            message: "Top 5 Events (Most Tickets Sold) successfully retrieved",
        });
    } catch (error) {
        response.json({
            success: false,
            message: error.message,
        });
    }
};