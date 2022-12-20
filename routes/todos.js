const router = require("express").Router();
const Todos = require("../models/todo");
const { User } = require("../models/user");

router.get("/:userId", async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userId,
    });

    if (!user) return res.status(400).send({ message: "User Invalid" });

    const todos = await Todos.findOne({
      userId: user._id,
    });

    res.status(200).send(todos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });

    if (!user) return res.status(400).send({ message: "User Invalid" });

    await Todos.updateOne(
      { userId: user._id },
      {
        $push: {
          todo: [
            {
              label: req.body.label,
            },
          ],
        },
      }
    );
    const todo = await Todos.findOne({
      userId: user._id,
    });

    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });

    if (!user) return res.status(400).send({ message: "User Invalid" });

    await Todos.updateOne(
      { userId: user._id, "todo._id": req.body.id },
      {
        $set: {
          "todo.$.label": req.body.label,
          "todo.$.color": req.body.color,
          "todo.$.isCompleted": req.body.isCompleted,
          "todo.$.isDeleted": req.body.isDeleted,
        },
      }
    );
    const todo = await Todos.findOne({
      userId: user._id,
    });

    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

module.exports = router;
