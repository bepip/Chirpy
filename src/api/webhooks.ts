import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error.js";
import { upgradeUserToRed } from "../db/queries/users.js";
import { verifyAPIKey } from "../lib/auth.js";

export async function handlerPolka(req: Request, res: Response) {
	type parameter = {
		event: string,
		data: {
			userId: string,
		};
	};

	if (!verifyAPIKey(req)) {
		throw new UnauthorizedError("invalid API key");
	}

	const params: parameter = req.body;
	if (!params.event || !params.data || !params.data.userId) {
		throw new BadRequestError("missing parameters");
	}
	if (params.event !== "user.upgraded") {
		res.status(204).send();
		return;
	}
	const statusUpgrade = await upgradeUserToRed(params.data.userId);
	if (!statusUpgrade) {
		throw new NotFoundError("user not found");
	}
	res.status(204).send();
}
