const { db } = require("./server/db");
if (process.env.NODE_ENV === "development") {
  require("./nothingToSeeHere");
}
const app = require("./server");
const PORT = process.env.PORT || 3000;

db.sync().then(() => {
  console.log("db synced");
  app.listen(PORT, () => console.log(`AYE YKTV LISTENING ON PORT ${PORT}`));
});
