import express from "express";
import Message from "../models/messages";
const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1 } = req.query;

  const _page = +page;
  const limit = 15;
  const skip = (_page - 1) * limit;

  try {
    const docs = await Message.find({})
      .sort("-timestamp")
      .skip(skip)
      .limit(limit);

    const count = await Message.countDocuments({});
    res.json({
      page: _page,
      limit,
      count,
      docs,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "error on fetch messages" });
  }
});

export default router;
