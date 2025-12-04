import express, { Response, Request } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./error.js";
import { resetUsers } from "../db/queries/users.js";

export async function handlerMetrics(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.write(`
		<html>
		  <body>
			<h1>Welcome, Chirpy Admin</h1>
			<p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
		  </body>
		</html>
	`);
	res.end();
	res.status(200).send();
}

export async function handlerMetricsReset(req: Request, res: Response) {
	if (config.api.platform !== "dev") {
		console.log(config.api.platform);
		throw new ForbiddenError();
	}
	config.api.fileserverHits = 0;
	await resetUsers();
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.status(200).send(`Reset all`);
}
