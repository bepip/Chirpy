import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./error.js";
import { createChirp, deleteChirp, getChirps, getChrip } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../lib/auth.js";
import { config } from "../config.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
	const token = getBearerToken(req);
	const userID = validateJWT(token, config.jwt.secret);
	type parameter = {
		body: string,
	}

	const params: parameter = req.body;
	if (!params.body) {
		throw new BadRequestError("Missing parameters");
	}

	const body = validateChirp(params.body);

	const chirp = await createChirp({ body, userId: userID });

	res.status(201).json({
		id: chirp.id,
		body: chirp.body,
		createdAt: chirp.createdAt,
		updatedAt: chirp.updatedAt,
		userId: chirp.userId
	});
}

export async function handlerChirpsGetAll(req: Request, res: Response) {
	const chirps = await getChirps();
	res.status(200).json(chirps);
}

export async function handlerChirpsRetrieve(req: Request, res: Response) {
	const chirpId = req.params.chirpID;

	const chirp = await getChrip(chirpId);

	if (!chirp) {
		throw new NotFoundError("Chirp not found");
	}

	res.status(200).json(chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
	const userID = validateJWT(getBearerToken(req));
	const chirpID = req.params.chirpID;
	const chirp = await getChrip(chirpID);
	if (!chirp) {
		throw new NotFoundError("Chirp not found");
	}
	if (chirp.userId !== userID) {
		throw new ForbiddenError();
	}
	const result = await deleteChirp(chirpID, userID);
	if (!result) {
		throw new Error("Failed to delete chirp");
	}

	res.status(204).send();
}

function validateChirp(body: string) {
	if (body.length > 140) {
		throw new BadRequestError("Chirp is too long. Max length is 140");
	}

	const profaneWords = ["kerfuffle", "sharbert", "fornax"];
	const filter = "****";
	const words: string[] = body.split(" ");

	let filteredWords = words.map((word) => {
		if (profaneWords.includes(word.toLowerCase())) {
			return filter;
		}
		return word;
	});
	return filteredWords.join(" ");
}
