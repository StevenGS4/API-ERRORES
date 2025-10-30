import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const port = process.env.PORT || 4000;

connectDB();

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
