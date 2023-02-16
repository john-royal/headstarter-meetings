import { Router } from 'express';
import { User } from '../models/user.model';

const userController = Router();

userController.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

userController.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    req.session.user = user;
    req.session.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

userController.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user == null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

userController.patch('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

export default userController;
