import AWS from 'aws-sdk';
import winston from 'winston';

const AWS_LAMBDA_CONFIG = {
  region: 'ap-southeast-2',
  apiVersion: '2015-03-31',
};

/*
 * Export a chart using the lambda function.
 */
export const exportChartScreenshot = async (
  chartConfig,
  sessionCookieName,
  sessionValue,
  email,
) => {
  const { region, apiVersion } = AWS_LAMBDA_CONFIG;

  AWS.config.update({ region });

  // For running locally, access keys are loaded from environment variables. On production, the ec2
  // instance has invokelambda access
  if (process.env.AWS_ACCESS_KEY_ID) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  const lambda = new AWS.Lambda({
    region,
    apiVersion,
  });
  const { exportUrl, selectedFormat, ...restOfChartConfig } = chartConfig;
  const chartUrl = `${process.env.EXPORT_URL}/${exportUrl}`;
  winston.log('Exporting chart', { exportUrl });
  const pullParams = {
    FunctionName: 'export-charts',
    InvocationType: 'Event',
    LogType: 'None',
    Payload: JSON.stringify({
      ...restOfChartConfig,
      chartUrl,
      email,
      fileType: selectedFormat,
      emailSubject: 'Your requested Tupaia charts',
      emailMessage:
        'Your requested Tupaia charts are attached to this email.<br /><br />Regards,<br />Tupaia Team',
      cookies: [
        {
          name: sessionCookieName,
          value: sessionValue,
          domain: process.env.EXPORT_COOKIE_URL,
          secure: true,
        },
      ],
    }),
  };
  // Make lambda request to do the exporting
  try {
    const lambdaRequest = lambda.invoke(pullParams);
    await lambdaRequest.promise(); // Call the lambda request using the promise based interface
  } catch (error) {
    winston.error(error);
    throw error;
  }
};
