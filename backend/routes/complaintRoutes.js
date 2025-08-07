/** @format */

import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Create a new complaint
router.post("/", async (req, res) => {
	const { title, description, category, branch, priority, submittedBy } =
		req.body;
	const complaint = new Complaint({
		title,
		description,
		category,
		branch,
		priority,
		submittedBy,
	});

	try {
		const savedComplaint = await complaint.save();
		res.status(201).json(savedComplaint);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get all complaints
router.get("/", async (req, res) => {
	try {
		const complaints = await Complaint.find().populate("submittedBy");
		res.status(200).json(complaints);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;
