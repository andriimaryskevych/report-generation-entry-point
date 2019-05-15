const AWS = require('aws-sdk');

console.log('Loading function');

exports.handler = async (event, context) => {
    try {
        let {
            dateFrom,
            dateTo
        } = event;

        console.log('Received parameters:');
        console.log('Date from:', dateFrom);
        console.log('Date to:', dateTo);

        if (!dateFrom || !dateTo) {
            console.log('One or more parameters are missing. Creating them automatically.');

            dateFrom = new Date();
            dateFrom.setFullYear(dateFrom.getFullYear() - 21);

            // Gerating report for the whole day, so adding one day to dateFrom
            dateTo = new Date(dateFrom);
            dateTo.setDate(dateTo.getDate() + 1);

            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);

            dateFrom = dateFrom.getTime();
            dateTo = dateTo.getTime();

            console.log('Parameters after processing');
            console.log('Date from:', dateFrom);
            console.log('Date to:', dateTo);
        }

        return {
            dateFrom,
            dateTo
        };
    } catch (error) {
        console.log('Error occured', error);

        throw error;
    }
};
