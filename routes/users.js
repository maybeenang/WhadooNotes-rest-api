const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({
      email: req.body.email,
    });
    if (user)
      return res.status(409).send({ message: "User already registered." });

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(user.password, salt);

    user = await new User({
      ...req.body,
      password: hashPassword,
    }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomInt(100000, 999999).toString(),
    }).save();
    // const link = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    const subject = "Verify your email address";
    const message = `Hello ${user.name},\n\nPlease verify your account with this OTP code \n\n${token.token}`;
    await sendEmail(user.email, subject, message);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid Link" });

    await User.updateOne({
      _id: user._id,
      verified: true,
    });

    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

module.exports = router;
