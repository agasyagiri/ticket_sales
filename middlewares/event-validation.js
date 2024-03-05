/** load Express Validator and Multer Library */
const { validationResult, body} = require(`express-validator`);

const validateEvent = [
    // Validation checks for the request body
    body('eventName').notEmpty().withMessage('Event Name is required'),
    body('eventDate').notEmpty().withMessage('Event Date is required'),
    body('venue').notEmpty().withMessage('Venue is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('image').notEmpty().withMessage('Image is required'),
  
    // Custom validation logic
    (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            /** get all error message */
            let errMessage = errors.array().map(it => it.msg).join(",")
            
            /** return error message with code 422 */
            return response.status(422).json({
                success: false,
                message: errMessage
            })
        }
        next(); // Proceed to the next middleware/route handler if validation passes
    }
];

module.exports = { validateEvent }