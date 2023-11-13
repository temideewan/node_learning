const fs = require("fs");
const server = require("http").createServer();
const path = require("path");

server.on("request", (req, res) => {
  // Solution 1
  // fs.readFile(path.join(__dirname, '/file.txt'), 'utf-8', (err, data) => {
  //   if(err) console.log(err);
  //   res.end(data);
  // })

  // Solution 2 streams
  // const readable = fs.createReadStream(path.join(__dirname, "/file.txt"));
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end();
  // });

  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });

  // Solution 3 pipe
  const readable = fs.createReadStream(path.join(__dirname, "/file.txt"));
  readable.pipe(res)
  // readable source into a writable response 
  // Solves the problem of back pressure

});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on 80000....");
});
