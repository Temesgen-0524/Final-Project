/** @format */

import express from "express";
import Election from "../models/Election.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Create a new election (Admin only)
router.post("/", authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== "admin" && !req.user.isAdmin) {
			return res.status(403).json({ message: "Admin access required" });
		}

		const {
			title,
			description,
			startDate,
			endDate,
			candidates,
			eligibleVoters = 12547
		} = req.body;

		const election = new Election({
			title,
			description,
			status: "Pending",
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			totalVotes: 0,
			eligibleVoters,
			candidates: candidates.map(candidate => ({
				...candidate,
				votes: 0
			})),
			voters: [],
			createdBy: req.user._id,
		});

		const savedElection = await election.save();
		res.status(201).json(savedElection);
	} catch (err) {
		console.error('Election creation error:', err);
		res.status(400).json({ message: err.message });
	}
});

// Get all elections
router.get("/", async (req, res) => {
	try {
		const elections = await Election.find()
			.populate("createdBy", "name email")
			.sort({ createdAt: -1 });
		res.status(200).json(elections);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get election by ID
router.get("/:id", async (req, res) => {
	try {
		const election = await Election.findById(req.params.id)
			.populate("createdBy", "name email")
			.populate("voters", "name email");
		
		if (!election) {
			return res.status(404).json({ message: "Election not found" });
		}
		
		res.status(200).json(election);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Vote in election
router.post("/:id/vote", authenticateToken, async (req, res) => {
	try {
		const { candidateId } = req.body;
		const election = await Election.findById(req.params.id);
		
		if (!election) {
			return res.status(404).json({ message: "Election not found" });
		}

		if (election.status !== "Ongoing") {
			return res.status(400).json({ message: "Election is not active" });
		}

		// Check if user already voted
		if (election.voters.includes(req.user._id)) {
			return res.status(400).json({ message: "You have already voted in this election" });
		}

		// Find candidate and increment votes
		const candidate = election.candidates.id(candidateId);
		if (!candidate) {
			return res.status(404).json({ message: "Candidate not found" });
		}

		candidate.votes += 1;
		election.totalVotes += 1;
		election.voters.push(req.user._id);

		await election.save();
		res.status(200).json({ message: "Vote cast successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update election status (Admin only)
router.patch("/:id/status", authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== "admin" && !req.user.isAdmin) {
			return res.status(403).json({ message: "Admin access required" });
		}

		const { status } = req.body;
		const election = await Election.findById(req.params.id);
		
		if (!election) {
			return res.status(404).json({ message: "Election not found" });
		}

		election.status = status;
		await election.save();
		
		res.status(200).json({ message: "Election status updated successfully", election });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Announce results (Admin only)
router.post("/:id/announce", authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== "admin" && !req.user.isAdmin) {
			return res.status(403).json({ message: "Admin access required" });
		}

		const election = await Election.findById(req.params.id);
		
		if (!election) {
			return res.status(404).json({ message: "Election not found" });
		}

		election.status = "Completed";
		await election.save();
		
		res.status(200).json({ message: "Election results announced successfully", election });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Delete election (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== "admin" && !req.user.isAdmin) {
			return res.status(403).json({ message: "Admin access required" });
		}

		const deletedElection = await Election.findByIdAndDelete(req.params.id);
		
		if (!deletedElection) {
			return res.status(404).json({ message: "Election not found" });
		}
		
		res.status(200).json({ message: "Election deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;