import { fromWebHandler } from "h3";
// @ts-expect-error dist/server/server.js is built by vite before nitro
import server from "../dist/server/server.js";

export default fromWebHandler((request) => server.fetch(request, {}, {}));
