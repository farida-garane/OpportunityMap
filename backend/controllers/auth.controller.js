const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { name, email, password, field, city, study_level } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const newUser = await authService.registerUser({ name, email, password, field, city, study_level });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === '23505') { // unique_violation (duplicate email)
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while registering user.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await authService.loginUser({ email, password });

    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json(result); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while logging in.' });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await authService.getUserProfile(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
}

module.exports = { register, login, getProfile };