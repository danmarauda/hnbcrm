import { authComponent, createAuth } from "./auth";
import router from "./router";

const http = router;

authComponent.registerRoutes(http, createAuth as any, { cors: true });

export default http;
