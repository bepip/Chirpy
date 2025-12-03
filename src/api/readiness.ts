import express, { Response, Request } from "express";

export async function handlerReadiness(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.status(200).send('OK');
}
