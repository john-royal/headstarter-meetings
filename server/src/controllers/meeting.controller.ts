import { Router } from 'express';
import sendEmail from '../helpers/email';
import { IUser, User } from '../models/user.model';

const meetingController = Router();

meetingController.post('/', async (req, res, next) => {
  try {
    if (req.session.user == null) {
      return res.status(401).json({ success: false, message: 'Not signed in' });
    }
    const { name, zoomUserId, zoomAccessToken } = (await User.findById(
      req.session.user._id,
    )) as IUser;
    if (zoomUserId == null || zoomAccessToken == null) {
      return res.status(401).json({ success: false, message: 'Zoom user not found' });
    }

    const { topic, startsAt, duration, attendees } = req.body;
    const meetingsUrl = `https://api.zoom.us/v2/users/${zoomUserId}/meetings`;

    const response = await fetch(meetingsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${zoomAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topic,
        type: 2, // Scheduled meeting
        start_time: startsAt,
        duration: duration, // Meeting duration in minutes
        timezone: 'America/New_York',
      }),
    });
    const meeting = await response.json();
    console.log('Meeting created: ', meeting);

    const attendeeEmails = attendees.map((attendee: IUser) => attendee.email);
    const subject = `${name} has invited you to a meeting`;
    const body = `Here is your Zoom meeting information: 
    Starts At: ${meeting.start_time}
    Duration: ${meeting.duration} minutes
    Meeting ID: ${meeting.id}
    Password: ${meeting.password}
    Join URL: ${meeting.join_url}
    `;
    await sendEmail({ destination: attendeeEmails, subject, body });

    res.json({ success: true, meeting });
  } catch (error) {
    next(error);
  }
});

export default meetingController;
