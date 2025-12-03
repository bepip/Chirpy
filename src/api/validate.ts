import express, { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerValidate(req: Request, res: Response) {
	type parameter = {
		body: string,
	};
	const params: parameter = req.body;
	if (!params.body) {
		return res.status(400).json({ error: "Something went wrong" });
	}
	if (params.body.length > 140) {
		return res.status(400).json({ error: "Chirp is too long" });
	}

	const profaneWords = ["kerfuffle", "sharbert", "fornax"];
	const filter = "****";
	const words: string[] = params.body.split(" ");
	let filteredWords = words.map((word) => {
		if (profaneWords.includes(word.toLowerCase())) {
			return filter;
		}
		return word;
	});
	return res.status(200).json({ cleanedBody: filteredWords.join(" ") });
}
