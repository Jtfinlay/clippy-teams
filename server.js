// Entry point to use for local https loading, which is required by teams.
// Read details here: https://medium.com/responsetap-engineering/nextjs-https-for-a-local-dev-server-98bb441eabd7
// Windows pfx generation here: https://medium.com/the-new-control-plane/generating-self-signed-certificates-on-windows-7812a600c2d8

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const httpsOptions = {
  // not secret exposure, as it is local dev signed cert
  pfx: fs.readFileSync("c:\\certs\\devcert.pfx"),
  passphrase: 'password123'
};
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:3000");
  });
});