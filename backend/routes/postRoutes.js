/** @format */

import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
	const {
		type,
		title,
		content,
		date,
		category,
		image,
		location,
		time,
		important,
	} = req.body;
	const post = new Post({
		type,
		title,
		content,
		date,
		category,
		image,
		location,
		time,
		important,
	});

	try {
		const savedPost = await post.save();
		res.status(201).json(savedPost);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get all posts
router.get("/", async (req, res) => {
	try {
		const posts = await Post.find();
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;
