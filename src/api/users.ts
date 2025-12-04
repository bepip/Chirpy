import { Request, Response } from "express"
import { BadRequestError } from "./error.js";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
	type parameter = {
		email: string,
	};

	const params: parameter = req.body;
	if (!params.email) {
		throw new BadRequestError("email not provided");
	}
	const user: NewUser = await createUser({ email: params.email });
	if (!user) {
		throw new Error("Failed to create new user");
	}
	res.status(201).json({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	});
}
