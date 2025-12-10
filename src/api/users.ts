import { Request, Response } from "express"
import { BadRequestError } from "./error.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { NewUser, UserResponse } from "../db/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "../lib/auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
	type parameter = {
		email: string,
		password: string
	};

	const params: parameter = req.body;
	if (!params.email || !params.password) {
		throw new BadRequestError("Missing parameters");
	}

	const hash = await hashPassword(params.password);

	const user: NewUser = await createUser({
		email: params.email,
		hashedPassword: hash
	});

	if (!user) {
		throw new Error("Failed to create new user");
	}

	res.status(201).json({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		isChirpyRed: user.isChirpyRed
	} satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
	type parameters = {
		password: string,
		email: string,
	};

	const params: parameters = req.body;
	if (!params.password || !params.email) {
		throw new BadRequestError();
	}

	const userID = validateJWT(getBearerToken(req));

	const hash = await hashPassword(params.password);

	const user: NewUser = await updateUser(userID, hash, params.email);

	res.status(200).json({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		isChirpyRed: user.isChirpyRed
	} satisfies UserResponse);
}
