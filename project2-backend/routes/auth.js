const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { RegisterValidation, LoginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken');

router.post('/register', async (req, res) => {
    const { error } = RegisterValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) return res.status(400).send('Email already exists.');

    console.log(req.body.password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({
            status: "Success",
            message: "User created successfully."
        });
    } catch (err) {
        res.status(500).send(err);
    }
})


router.post('/login', async (req, res) => {

    console.log(req.body);

    const { error } = LoginValidation(req.body);

    if (error) return res.status(400).send({ 'error': error.details[0].message });

    const user = await User.findOne({ email: req.body.email }, function (err, obj) { if (err) console.log(err); });

    if (!user) return res.status(400).send('Email or password is incorrect');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email or password is incorrect');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.status(200).header('auth-token', token).send({
        status: "Success",
        message: "Logged In"
    });
})

router.post('/validatetoken', verify, async (req, res) => {
    res.status(200).send({
        tokenValid: true
    });
});

module.exports = router;