import express, { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerMetrics(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.write(`
		<html>
		  <body>
			<h1>Welcome, Chirpy Admin</h1>
			<p>Chirpy has been visited ${config.fileserverHits} times!</p>
		  </body>
		</html>
	`);
	res.end();
	res.status(200).send();
}

export async function handlerMetricsReset(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	const hits = config.fileserverHits = 0;
	res.status(200).send(`Hits reset: ${hits}`);
}
