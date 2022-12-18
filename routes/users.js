const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");

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

    await new User({
      ...req.body,
      password: hashPassword,
    }).save();
    res.status(201).send({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

module.exports = router;
