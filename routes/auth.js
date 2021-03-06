const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {

  //Validate the data before user is created
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    const savedUser = await user.save();
    res.send(savedUser);
    console.log(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.post('/login', async (req, res) => {

  //Validate the data before user is created
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the email in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email is not found');

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  res.send('Logged in!')
});

module.exports = router;