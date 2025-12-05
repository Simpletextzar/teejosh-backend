import express from "express";
const cors = require("cors");
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// ---------------- Swagger Config ----------------
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TeeJosh API",
      version: "1.0.0",
      description:
        "Documentación de la API del sistema de inventario de Teejosh",
    },
  },
  apis: ["./src/index.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ----------------------------------------------------

/**
 * @openapi
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
app.get("/productos", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Obtener todos los items con información relacionada
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Lista de items
 */
app.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        producto: { select: { id: true, nombre: true } },
        edicion: { select: { id: true, nombre: true } },
        lenguaje: { select: { id: true, nombre: true } },
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /items/{id}:
 *   get:
 *     summary: Obtener un item por su ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item no encontrado
 */
app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /items:
 *   post:
 *     summary: Crear un nuevo item
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_producto:
 *                 type: integer
 *               precio:
 *                 type: number
 *               cantidad:
 *                 type: integer
 *               id_edicion:
 *                 type: integer
 *                 nullable: true
 *               id_lenguaje:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item creado exitosamente
 */
app.post("/items", async (req, res) => {
  const { id_producto, precio, cantidad, id_edicion, id_lenguaje } = req.body;
  try {
    const item = await prisma.item.create({
      data: {
        id_producto,
        precio,
        cantidad,
        id_edicion: id_edicion || null,
        id_lenguaje,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /items/{id}:
 *   put:
 *     summary: Actualizar un item por su ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item actualizado
 *       404:
 *         description: Item no encontrado
 */
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
        id_lenguaje,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /items/{id}:
 *   delete:
 *     summary: Eliminar un item por su ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item eliminado correctamente
 */
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /ediciones:
 *   get:
 *     summary: Obtener todas las ediciones
 *     tags:
 *       - Ediciones
 *     responses:
 *       200:
 *         description: Lista de ediciones
 */
app.get("/ediciones", async (req, res) => {
  try {
    const ediciones = await prisma.edicion.findMany();
    res.json(ediciones);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /lenguajes:
 *   get:
 *     summary: Obtener todos los lenguajes
 *     tags:
 *       - Lenguajes
 *     responses:
 *       200:
 *         description: Lista de lenguajes
 */
app.get("/lenguajes", async (req, res) => {
  try {
    const lenguajes = await prisma.lenguaje.findMany();
    res.json(lenguajes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
