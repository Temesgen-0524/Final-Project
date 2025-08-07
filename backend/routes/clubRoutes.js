/** @format */

import express from "express";
import Club from "../models/Club.js";

const router = express.Router();

// Create a new club
router.post("/", async (req, res) => {
	const { name, category, members, description, image, events, founded } =
		req.body;
	const club = new Club({
		name,
		category,
		members,
		description,
		image,
		events,
		founded,
	});

	try {
		const savedClub = await club.save();
		res.status(201).json(savedClub);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get all clubs
router.get("/", async (req, res) => {
	try {
		const clubs = await Club.find();
		res.status(200).json(clubs);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;
