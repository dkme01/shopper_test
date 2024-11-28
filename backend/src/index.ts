import { createServer } from "./server";

const port = process.env.PORT || 8080;
const server = createServer();

server.listen(port, () => {
  console.log(`server running on ${port}`);
});
