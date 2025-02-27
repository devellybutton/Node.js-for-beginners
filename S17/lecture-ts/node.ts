import fs from "fs/promises";

fs.readFile("package.json")
  .then((result) => {
    console.log(result);
  })
  .catch(console.error);
