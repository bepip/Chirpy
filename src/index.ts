import express, { Response, Request } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";
import { handlerValidate } from "./api/validate.js";
import { errorHandler, middlewareError } from "./api/error.js";

const app = express();
const PORT = 8080;

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
app.get("/admin/metrics", errorHandler(handlerMetrics));
app.post("/admin/reset", errorHandler(handlerMetricsReset));
app.post("/api/validate_chirp", errorHandler(handlerValidate));

app.use(middlewareError);


app.listen(PORT, () => {
	console.log(`Server is running at https://localhost:${PORT}`);
});

