import express, { Response, Request } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";
import { handlerValidate } from "./api/validate.js";
import { errorHandler, middlewareError } from "./api/error.js";
import postgres from "postgres";
import { config } from "./config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import { handlerChirpsCreate, handlerChirpsGetAll, handlerChirpsRetrieve, handlerDeleteChirp } from "./api/chirps.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/login.js";
import { handlerPolka } from "./api/webhooks.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/", (req: Request, res: Response) => {
	res.redirect("/app");
});

app.get("/api/healthz", async (req, res, next) => {
	try {
		await handlerReadiness(req, res);
	} catch (err) {
		next(err);
	}
});

//admin
app.get("/admin/metrics", errorHandler(handlerMetrics));
app.post("/admin/reset", errorHandler(handlerMetricsReset));
//api
app.post("/api/users", errorHandler(handlerCreateUser));
app.put("/api/users", errorHandler(handlerUpdateUser));
app.post("/api/chirps", errorHandler(handlerChirpsCreate));
app.get("/api/chirps", errorHandler(handlerChirpsGetAll));
app.get("/api/chirps/:chirpID", errorHandler(handlerChirpsRetrieve));
app.delete("/api/chirps/:chirpID", errorHandler(handlerDeleteChirp));
app.post("/api/login", errorHandler(handlerLogin));
app.post("/api/refresh", errorHandler(handlerRefresh));
app.post("/api/revoke", errorHandler(handlerRevoke));
//api/polka/
app.post("/api/polka/webhooks", errorHandler(handlerPolka));


app.use(middlewareError);


app.listen(config.api.port, () => {
	console.log(`Server is running at https://localhost:${config.api.port}`);
});

