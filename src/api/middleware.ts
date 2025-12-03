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
	config.fileserverHits++;
	next();
}
