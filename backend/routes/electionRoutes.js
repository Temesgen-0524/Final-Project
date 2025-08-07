/** @format */

import express from "express";
import Election from "../models/Election.js";

const router = express.Router();

// Create a new election
router.post("/", async (req, res) => {
	const {
		title,
		description,
		status,
		startDate,
		endDate,
		eligibleVoters,
		candidates,
	} = req.body;
	const election = new Election({
		title,
		description,
		status,
		startDate,
		endDate,
		eligibleVoters,
		candidates,
	});

	try {
		const savedElection = await election.save();
		res.status(201).json(savedElection);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get all elections
router.get("/", async (req, res) => {
	try {
		const elections = await Election.find();
		res.status(200).json(elections);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Vote for a candidate
router.post("/:electionId/vote", async (req, res) => {
	const { candidateId } = req.body;
	const { electionId } = req.params;

	try {
		const election = await Election.findById(electionId);
		if (!election) {
			return res.status(404).json({ message: "Election not found" });
		}

		const candidate = election.candidates.id(candidateId);
		if (!candidate) {
			return res.status(404).json({ message: "Candidate not found" });
		}

		candidate.votes += 1;
		election.totalVotes += 1;

		await election.save();
		res.status(200).json({ message: "Vote cast successfully", election });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;
