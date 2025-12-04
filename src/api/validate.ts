import express, { Response, Request } from "express";
import { config } from "../config.js";
import { BadRequestError } from "./error.js";

export async function handlerValidate(req: Request, res: Response) {
	type parameter = {
		body: string,
	};
	const params: parameter = req.body;
	if (!params.body) {
		res.status(400).json({ error: "Something went wrong" });
		return;
	}
	if (params.body.length > 140) {
		throw new BadRequestError("Chirp is too long. Max length is 140");
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
	res.status(200).json({ cleanedBody: filteredWords.join(" ") });
	return;
}
