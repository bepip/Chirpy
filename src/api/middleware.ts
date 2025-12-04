import express, { Response, Request, NextFunction } from "express";
import { config } from "../config.js";

export async function middlewareLogResponses(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.on("finish", () => {
		const status = res.statusCode;
		const method = req.method;
		const url = req.url;
		if (status > 299 || status < 199) {
			console.log(`[NON-OK] %s %s - Status: %d`, method, url, status);
		}
	});
	next();
}

export async function middlewareMetricsInc(
	req: Request,
	res: Response,
	next: NextFunction
) {
	config.api.fileserverHits++;
	next();
}

export async function middlewareJSONBodyParser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", () => {
		if (!body) {
			return next();
		}
		try {
			req.body = JSON.parse(body);
			next();
		} catch (err) {
			res.status(400).json({ error: "Invalid JSON" });
		}
	});

	req.on("error", () => {
		res.status(400).json({ error: "Error reading request body" });
	});
}
