const express = require('express');
require('dotenv').config();
const Schema = require('../Database/userschema.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const { Full_Name, Username, Password } = req.body;
  if (!Full_Name || !Username || !Password) {
    return res.status(400).send("Require all the elements");
  }
  try {
    const Userfind = await Schema.findOne({ Username: Username });
    if (Userfind) {
      return res.status(400).json({ message: `Username already taken` });
    }

    const hashedPassword = await bcrypt.hash(Password, 11);
    const newuser = new Schema({ Full_Name, Username, Password: hashedPassword });
    await newuser.save();

    const token = jwt.sign(
      { userId: newuser._id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
    console.log(`${Username}`);
    res.status(201).json({ message: `Registered  ${Username} Successfully`, token: token });

  }

  catch (error) {
    console.log(`Error during saving data in database ${error}`);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    return res.status(500).json({ message: 'Server Error' });
  }

})
router.post('/login', async (req, res) => {

  let { Username, Password } = req.body;
  if (!Username || !Password) {
    return res.status(400).json({ message: `Enter both Username and Password` });
  }
  try {
    const user = await Schema.findOne({ Username: Username });
    if (!user) {
      return res.status(404).json({ message: `Invalid Username Or Password` });
    }
    const checkpassword = await bcrypt.compare(Password, user.Password);
    if (!checkpassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
    res.status(200).json({ message: `Logged In`, token: token });
  }
  catch (e) {
    console.log('Login error:', e);
    res.status(500).json({ message: 'Server error during login' });
  }
})

module.exports = router;
