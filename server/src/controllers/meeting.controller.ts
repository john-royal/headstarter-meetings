import { Router } from 'express';
import { IUser, User } from '../models/user.model';

const meetingController = Router();

meetingController.post('/', async (req, res, next) => {
  try {
    if (req.session.user == null) {
      return res.status(401).json({ success: false, message: 'Not signed in' });
    }
    const { zoomUserId, zoomAccessToken } = (await User.findById(req.session.user._id)) as IUser;
    if (zoomUserId == null || zoomAccessToken == null) {
      return res.status(401).json({ success: false, message: 'Zoom user not found' });
    }

    const { type, startsAt, duration, attendees } = req.body;
    const meetingsUrl = `https://api.zoom.us/v2/users/${zoomUserId}/meetings`;

    const body = JSON.stringify({
      topic: type,
      type: 2, // Scheduled meeting
      start_time: startsAt,
      duration: duration, // Meeting duration in minutes
      timezone: 'America/New_York',
    });

    const response = await fetch(meetingsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${zoomAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const meeting = await response.json();
    console.log('Meeting created: ', meeting);

    res.json({ success: true, meeting });
  } catch (error) {
    next(error);
  }
});

export default meetingController;
