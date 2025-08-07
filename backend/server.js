/** @format */

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Import models
import User from "./models/User.js";
import Complaint from "./models/Complaint.js";
import Club from "./models/Club.js";
import Post from "./models/Post.js";
import Election from "./models/Election.js";
import ContactMessage from "./models/ContactMessage.js"; // Import the ContactMessage model

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors({
	origin: ["http://localhost:5173", "http://localhost:3000"],
	credentials: true
}));
app.use(express.json());
console.log("MongoDB URI:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected successfully!"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Middleware to check MongoDB connection
const checkMongoDBConnection = (req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		// 1 means connected
		next(); // Proceed to the next middleware or route
	} else {
		res.status(500).json({ message: "MongoDB connection is not available." });
	}
};

// Use the MongoDB connection checker middleware
app.use(checkMongoDBConnection);

// Use routes
app.use("/users", userRoutes);
app.use("/complaints", complaintRoutes);
app.use("/clubs", clubRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/", (req, res) => {
	res.json({ message: "DBU Student Union API is running!" });
});

// Endpoint to add a new user
app.post("/users", async (req, res) => {
	const { name, email } = req.body;

	const user = new User({ name, email });
	try {
		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Endpoint to get all users
app.get("/users", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Endpoint to add a new complaint
app.post("/complaints", async (req, res) => {
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

// Endpoint to get all complaints
app.get("/complaints", async (req, res) => {
	try {
		const complaints = await Complaint.find().populate("submittedBy");
		res.status(200).json(complaints);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Endpoint to add a new club
app.post("/clubs", async (req, res) => {
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

// Endpoint to get all clubs
app.get("/clubs", async (req, res) => {
	try {
		const clubs = await Club.find();
		res.status(200).json(clubs);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Endpoint to add a new post
app.post("/api/posts", async (req, res) => {
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

// Endpoint to get all posts
app.get("/api/posts", async (req, res) => {
	try {
		const posts = await Post.find();
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Endpoint to add a new election
app.post("/api/elections", async (req, res) => {
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

// Endpoint to get all elections
app.get("/api/elections", async (req, res) => {
	try {
		const elections = await Election.find();
		res.status(200).json(elections);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Endpoint to vote for a candidate
app.post("/api/elections/:electionId/vote", async (req, res) => {
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

// Endpoint to submit a contact message
app.post("/api/contact", async (req, res) => {
	const { name, email, subject, message, category } = req.body;

	const contactMessage = new ContactMessage({
		name,
		email,
		subject,
		message,
		category,
	});
	try {
		const savedMessage = await contactMessage.save();
		res.status(201).json(savedMessage);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
