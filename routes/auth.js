const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
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
    if (!user)
      return res.status(401).send({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password." });

    if (!user.verified) {
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const link = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      const subject = "Verify your email address";
      const message = `Hello ${user.name},\n\nPlease verify your account by clicking the link: ${link}`;
      await sendEmail(user.email, subject, message);
      return res
        .status(401)
        .send({ message: "Please verify your email address." });
    }

    const token = user.generateAuthToken();
    res
      .status(200)
      .send({ data: token, message: "User logged in successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().label("Name"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(user);
};

module.exports = router;
