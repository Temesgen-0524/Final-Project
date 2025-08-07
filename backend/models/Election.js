/** @format */

import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
	name: { type: String, required: true },
	position: { type: String, required: true },
	votes: { type: Number, default: 0 },
	profileImage: { type: String, required: true },
	platform: { type: [String], required: true },
});

const ElectionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: ["Ongoing", "Completed", "Pending"],
		required: true,
	},
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	totalVotes: { type: Number, default: 0 },
	eligibleVoters: { type: Number, required: true },
	candidates: [CandidateSchema],
});

const Election = mongoose.model("Election", ElectionSchema);

export default Election;
