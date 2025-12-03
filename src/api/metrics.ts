import express, { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerMetrics(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	const hits = config.fileserverHits;
	res.status(200).send(`Hits: ${hits}`);
}

export async function handlerMetricsReset(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	const hits = config.fileserverHits = 0;
	res.status(200).send(`Hits reset: ${hits}`);
}
