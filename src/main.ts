import { app } from "./application/app";
import { logger } from "./application/logging";

app.listen(3000, () => {
  logger.info("Listening on port 3000");
});
