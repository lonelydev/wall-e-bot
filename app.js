/**
 * 
 * @param {*} event
 *  slack post request with additional properties
 * @param {*} context 
 * nodejs context
 * @param {*} callback
 * function that accepts two argument, error and data
 * response must be compatible with json stringify 
 */
exports.handler = (event, context, callback) => {
    const response = {'message': 'Hello World'};
    callback(null, response);
}