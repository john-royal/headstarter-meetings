import { User } from '../models/user.model';
import { Router } from 'express';

const sessionController = Router();

sessionController.get('/', async (req, res, next) => {
  try {
    const id = req.session?.user?._id;

    if (id == null) {
      return res.status(401).send({ success: false, message: 'Not signed in' });
    }

    const user = await User.findById(id);

    if (user == null) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

sessionController.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user == null) {
      return res.status(404).send({ success: false, message: 'User not found' });
    } else if (!(await user.verifyPassword(password))) {
      return res.status(401).send({ success: false, message: 'Wrong password' });
    }

    req.session.user = user;
    req.session.save((error) => {
      if (error) next(error);
      else res.json({ success: true, user });
    });
  } catch (error) {
    next(error);
  }
});

sessionController.delete('/', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) next(error);
    else res.json({ success: true });
  });
});

export default sessionController;
