const fs = require("node:fs");
const http = require("http");
const url = require("url");

//
/////////////// FILES ////////////////

// blocking synchronous pattern
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// // console.log(textIn);
// const textOut = `This is what we know about the avocado ${textIn}. \n created on ${Date.now()}`;

// // fs.writeFileSync("./txt/output.txt", textOut);
// // console.log('file written');

// // non blocking

// fs.readFile("./txt/starasdfabdt.txt", "utf-8", (err, data1) => {
//   if(err){
//     return console.log("Error 🤯");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt",`${data2} \n${data3}`, "utf-8", (err) => {
//         console.log("Your file was successfully written 🥲");
//       });
//     });
//   });
// });

// console.log("Will read file");

/////////////// FILES ////////////////

//////////////////SERVER/////////////////////////////////
/**
 *  "id": 0,
    "productName": "Fresh Avocados",
    "image": "🥑",
    "from": "Spain",
    "nutrients": "Vitamin B, Vitamin K",
    "quantity": "4 🥑",
    "price": "6.50",
    "organic": true,
    "description": "A ripe avocado yields to gentl
 */
/**
 * @typedef Product
 * @property {string} productName
 * @property {string} image
 * @property {number} id
 * @property {string} from
 * @property {boolean} organic
 * @property {string} description
 * @property {string} price
 * @property {string} quantity
 * @property {string} nutrients
 *
 * @param {string} temp
 * @param {Product} product
 */
function replaceTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
}
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const {query,pathname} = url.parse(req.url, true);


  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((data) => replaceTemplate(templateCard, data))
      .join("");
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // not found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
  // res.end("Hello from the server");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
