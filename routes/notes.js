const router = require("express").Router();
const Notes = require("../models/note");
const { User } = require("../models/user");

router.get("/:userId", async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userId,
    });

    if (!user) return res.status(400).send({ message: "User Invalid" });

    const notes = await Notes.findOne({
      userId: user._id,
    });

    res.status(200).send(notes);
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

    await Notes.updateOne(
      { userId: user._id },
      {
        $push: {
          note: [
            {
              title: req.body.title,
              description: req.body.description,
            },
          ],
        },
      }
    );

    res.status(201).send({ message: "Note Created Successfully" });
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

    await Notes.updateOne(
      { userId: user._id, "note._id": req.body.noteId },
      {
        $set: {
          "note.$.title": req.body.title,
          "note.$.description": req.body.description,
          "note.$.date": new Date().toISOString(),
          "note.$.color": req.body.color,
          "note.$.isPinned": req.body.isPinned,
          "note.$.isArchived": req.body.isArchived,
          "note.$.isDeleted": req.body.isDeleted,
        },
      }
    );

    res.status(201).send({ message: "Note Updated Successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

module.exports = router;
