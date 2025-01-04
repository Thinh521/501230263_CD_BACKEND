import express from "express";
import path from "path";

const app = express();
const port = 5001;
const _dirname = path.resolve();

app.use("/static", express.static(path.join(_dirname, "public")));

app.set("view engine", "ejs");
app.set("views", _dirname + "/src/views");

app.get("/index", (req, res) => {
  res.render("pages/index", {
    title: "Home",
  });
});

app.get("/components", (req, res) => {
  res.render("pages/components", {
    title: "Components",
  });
});

app.get("/forms", (req, res) => {
  res.render("pages/forms", {
    title: "Forms",
  });
});

app.get("/icons", (req, res) => {
  res.render("pages/icons", {
    title: "Icons",
  });
});

app.get("/notifications", (req, res) => {
  res.render("pages/notifications", {
    title: "Notifications",
  });
});

app.get("/tables", (req, res) => {
  res.render("pages/tables", {
    title: "Tables",
  });
});

app.get("/typography", (req, res) => {
  res.render("pages/typography", {
    title: "Typography",
  });
});

app.listen(port, function () {
  console.log("http://localhost:" + port);
});
