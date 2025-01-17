const http = require("http");
const { v4 } = require("uuid");
const getBodyData = require("./util");

let books = [
  {
    id: "1",
    title: "Book n1",
    pages: 250,
    author: "Writer 1",
  },
  {
    id: "2",
    title: "Book n2",
    pages: 300,
    author: "Writer 2",
  },
  {
    id: "3",
    title: "Book n3",
    pages: 350,
    author: "Writer 3",
  },
];

const server = http.createServer(async (req, res) => {
  if (req.url === "/books" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json charset=utf8",
    });

    const resp = {
      status: "OK",
      books,
    };

    res.end(JSON.stringify(resp));
  } else if (req.url === "/books" && req.method === "POST") {
    const data = await getBodyData(req);
    const { title, pages, author } = JSON.parse(data);
    const newBook = {
      id: v4(),
      title,
      pages,
      author,
    };
    books.push(newBook);
    const resp = {
      status: "Created",
      book: newBook,
    };

    res.writeHead(200, {
      "Content-Type": "application/json charset=utf8",
    });

    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[2];
    const book = books.find((b) => b.id === id);
    res.writeHead(200, {
      "Content-Type": "application/json charset=utf8",
    });
    const resp = {
      status: "OK",
      book,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "PUT") {
    const id = req.url.split("/")[2];
    const data = await getBodyData(req);
    const { title, pages, author } = JSON.parse(data);
    const idx = books.findIndex((b) => b.id === id);
    const changeBook = {
      id: books[idx].id,
      title: title || books[idx].title,
      pages: pages || books[idx].pages,
      author: author || books[idx].author,
    };
    books[idx] = changeBook;
    res.writeHead(200, {
      "Content-Type": "application/json charset=utf8",
    });
    const resp = {
      status: "OK",
      book: changeBook,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    books = books.filter((b) => b.id !== id);
    res.writeHead(200, {
      "Content-Type": "application/json charset=utf8",
    });
    const resp = {
      status: "DELETED",
    };
    res.end(JSON.stringify(resp));
  }
});

server.listen(3000, () => console.log("Server running on port: 3000"));
