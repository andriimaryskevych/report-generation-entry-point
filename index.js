const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

console.log('Loading function');

const queueURL = 'https://sqs.eu-central-1.amazonaws.com/608669370019/reports-queue';

exports.handler = (event, context, callback) => {
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

        var params = {
            MessageBody: JSON.stringify({ dateFrom, dateTo }),
            QueueUrl: queueURL,
            DelaySeconds: 0
        };

        console.log('Sending message to queue', JSON.stringify(params));

        sqs.sendMessage(params, (err, data) => {
            if (!err) {
                console.log('Successfully pushed message to queue', JSON.stringify(data))
                callback(null, {
                    dateFrom,
                    dateTo
                });
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.log('Error occured', error);

        callback(error, null);
    }
};
