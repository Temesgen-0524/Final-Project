/** @format */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Access token required" });
		}

		// Handle mock admin tokens (base64 encoded)
		if (token.length > 100 && !token.includes('.')) {
			try {
				const decoded = JSON.parse(atob(token));
				if (decoded.exp && decoded.exp > Date.now()) {
					req.user = {
						_id: decoded.userId,
						email: decoded.email,
						role: decoded.role,
						isAdmin: decoded.isAdmin || decoded.role === "admin",
					};
					return next();
				}
			} catch (e) {
				// Continue to JWT verification
			}
		}
		
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
		const user = await User.findById(decoded.userId);

		if (!user) {
			// Handle mock users for development
			if (decoded.userId && decoded.email) {
				req.user = {
					_id: decoded.userId,
					email: decoded.email,
					role: decoded.role || "student",
					isAdmin: decoded.role === "admin",
				};
				return next();
			}
			return res.status(401).json({ message: "User not found" });
		}

		req.user = {
			...user.toObject(),
			isAdmin: user.role === "admin",
		};
		next();
	} catch (error) {
		console.error('Auth error:', error.message);
		return res.status(403).json({ message: "Invalid token" });
	}
};

export const requireAdmin = (req, res, next) => {
	if (req.user.role !== "admin" && !req.user.isAdmin) {
		return res.status(403).json({ message: "Admin access required" });
	}
	next();
};