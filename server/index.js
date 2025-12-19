import dotenv from "dotenv";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidV4 } from "uuid";
import sql from "./postdb.js";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "client")));
app.set("views", path.join(__dirname, "..", "client", "document"));

// Redirect /document to a new UUID
app.get("/:user_id/document", (req, res) => {
  const user_id = req.params.user_id.replace(":", "");
  console.log(user_id);
  const documentId = uuidV4();
  res.redirect(`/${user_id}/document/${documentId}`);
});

// Serve document by UUID
app.get("/:user_id/document/:uuid", async (req, res) => {
  const rows = await sql`
    SELECT * FROM documents
    WHERE user_id = ${req.params.user_id} AND uuid = ${req.params.uuid}
  `;

  if (rows.length === 0) {
    res.sendFile(
      path.join(__dirname, "..", "client", "document", "document_new.html")
    );
  } else {
    const documentData = rows[0];
    const ops =
      typeof documentData.document === "string"
        ? JSON.parse(documentData.document).ops
        : documentData.document.ops;

    console.log(ops);

    res.render("document.ejs", {
      context: ops,
    });
  }
});

app.post("/save", async (req, res) => {
  if (
    (await sql`SELECT
    *
FROM
    documents
WHERE
    user_id = ${req.body.user_id}
    AND uuid = ${req.body.uuid}`) == 0
  ) {
    const result = await sql`
        insert into documents (user_id,uuid,document)
        values (
          ${req.body.user_id}, 
          ${req.body.uuid}, 
          ${req.body.doc_info}
        )
        returning *
      `;
    res.status(201).json(result);
  } else {
    const result = await sql`
    UPDATE documents 
              SET document = ${req.body.doc_info} 
              WHERE user_id = ${req.body.user_id}
    AND uuid = ${req.body.uuid}
  `;
    res.status(201).json(result);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
