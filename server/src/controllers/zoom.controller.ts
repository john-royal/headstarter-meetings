import { Router } from 'express';
import { randomBytes } from 'crypto';
import { User } from '../models/user.model';

const CALLBACK_URL = 'http://localhost:3000/api/zoom/callback';

const zoomController = Router();

zoomController.get('/connect', async (req, res, next) => {
  try {
    const state = randomBytes(20).toString('hex');
    req.session.state = state;
    req.session.save((error) => {
      if (error) next(error);
      else {
        const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${state}`;
        res.redirect(url);
      }
    });
  } catch (error) {
    next(error);
  }
});

zoomController.get('/callback', async (req, res, next) => {
  const { code, state } = req.query;

  //   Verify the state value to prevent CSRF attacks
  if (state !== req.session.state) {
    return res.status(403).send('Invalid state');
  }

  try {
    const { access_token: zoomAccessToken, refresh_token: zoomRefreshToken } =
      await getTokensForUser(code as string);
    const { id: zoomUserId } = await getUserInfo(zoomAccessToken);

    // Save the user's access token in your database
    await User.findByIdAndUpdate(req.session.user._id, {
      zoomUserId,
      zoomAccessToken,
      zoomRefreshToken,
    });

    // Redirect the user back to your app
    res.redirect('/zoom');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

export default zoomController;

async function getTokensForUser(authorizationCode: string) {
  // Exchange the authorization code for an access token
  const url = 'https://zoom.us/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode as string,
    redirect_uri: CALLBACK_URL,
  });
  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await fetch(url, {
    method: 'POST',
    body: body.toString(),
    headers: headers,
  });

  if (!response.ok) {
    throw new Error('Failed to exchange authorization code for access token');
  }

  return (await response.json()) as { access_token: string; refresh_token: string };
}

async function getUserInfo(accessToken: string) {
  const response = await fetch(`https://api.zoom.us/v2/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return (await response.json()) as { id: string };
  } else {
    throw new Error(`Failed to fetch user ID: ${response.statusText}`);
  }
}
