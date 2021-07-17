const jsonServer = require("json-server");
const app = jsonServer.create();
const router = jsonServer.router(require("./mockdb"));
const middleWare = jsonServer.defaults();
const pause = require('connect-pause');

const port = 3002;
const customRoutes = jsonServer.rewriter(require("./configs/route.config"));
const customHttpMethods = require("./configs/optional/http-method.config");
const customHttpStatusMessages = require("./configs/optional/http-status-message.config");
const customHttpStatusCodes = require("./configs/optional/http-status.config");

const delay = 1500;

for (const path of Object.keys(customHttpMethods)) {
  const obj = customHttpMethods[path];
  app[obj](path, (req: any, res: any, next: any) => {
    req.method = "GET";
    console.log(`[JSON_SERVER] "${path}" METHOD "${obj.toUpperCase()}" --> "GET"`);
    next();
  })
}

app.use(function(req: any, res: any, next: any) {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
  next();
});

app.use(pause(delay));
app.use(middleWare);
app.use(customRoutes);
app.use(router)

app.listen(port, () => {
  console.log(`[JSON-SERVER] running on port ${port}`);
});
