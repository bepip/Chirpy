import express, { Response, Request } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";
import { handlerValidate } from "./api/validate.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/", (req:Request, res:Response) => {
	res.redirect("/app");
});

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);
app.post("/api/validate_chirp", handlerValidate);


app.listen(PORT, () => {
	console.log(`Server is running at https://localhost:${PORT}`);
});

