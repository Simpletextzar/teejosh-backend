import express from "express";
const cors = require("cors");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (or replace "*" with your frontend URL in production)
// app.use(cors());
// app.options("*", cors()); // Handle preflight requests
app.use(cors({ origin: "*" }));

app.use(express.json());

// Endpoint de productos
// GET all productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Endpoint de items
// GET all items
app.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET single item by ID
app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) }
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE new item
app.post("/items", async (req, res) => {
  const { id_producto, precio, cantidad, id_edicion, id_lenguaje } = req.body;
  try {
    const item = await prisma.item.create({
      data: {
        id_producto,
        precio,
        cantidad,
        id_edicion: id_edicion || null,
        id_lenguaje
      }
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE item by ID
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { id_producto, precio, cantidad, id_edicion, id_lenguaje } = req.body;
  try {
    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        id_producto,
        precio,
        cantidad,
        id_edicion: id_edicion || null,
        id_lenguaje
      }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE item by ID
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
