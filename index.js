const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

console.log('Loading function');

const queueURL = 'https://sqs.eu-central-1.amazonaws.com/608669370019/reports-queue';

exports.handler = async (event) => {
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
            MessageBody: 'Hello world!',
            QueueUrl: queueURL,
            DelaySeconds: 0
        };

        sqs.sendMessage(params, function(err, data) {
            if(err) {
                res.send(err);
            }
            else {
                res.send(data);
            }
        });

        return {
            dateFrom,
            dateTo
        };
    } catch (error) {
        console.log('Error occured', error);

        throw error;
    }
};
