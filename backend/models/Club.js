/** @format */

import mongoose from "mongoose";
const clubSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	description: { type: String },
	image: { type: String },
	events: [
		{
			title: { type: String, required: true },
			date: { type: Date, required: true },
		},
	],
	founded: { type: Date },
});

const Club = mongoose.model("Club", clubSchema); // Use `clubSchema` instead of `ClubSchema`

export default Club;
