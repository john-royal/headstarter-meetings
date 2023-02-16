import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  credentials: new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
  region: process.env.AWS_REGION,
});
const ses = new AWS.SES();

export default function sendEmail({
  destination,
  subject,
  body,
}: {
  destination: string[];
  subject: string;
  body: string;
}) {
  const emailParams = {
    Source: 'johnmroyal1@gmail.com',
    Destination: {
      ToAddresses: destination,
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };
  console.dir(emailParams, { depth: null })
  return new Promise((resolve, reject) => {
    ses.sendEmail(emailParams, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
