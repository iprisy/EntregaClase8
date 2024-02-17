const { Router } = require("express");
const productsData = require("../data/products");
const { update } = require("../model/product.model");
const router = Router();

const productsModel = require("../model/product.model");

router.get("/insertion", async (req, res) => {
  let result = await productsModel.insertMany(productsData);
  return res.json({
    message: "all the products are inserted succesfully",
    result,
  });
});

router.get("/", async (req, res) => {
  // http://localhost:5000/api/products?precioUnitario=2 o http://localhost:5000/api/products?cantidad>=3
  const { precioUnitario } = req.query;

  const result = await productsModel
    .find(!precioUnitario ? {} : { precioUnitario: `${precioUnitario}` })
    .sort({ precioUnitario: 1 });

  // version 2 de la query
  // const result = await productsModel.aggregate([
  //   { $match: !precioUnitario ? {} : { precioUnitario: `${precioUnitario}` } },
  // ]);

  return res.json({
    message: "getAllProducts succesfully",
    products: result,
    productsSize: result.length,
  });
});

router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, precioUnitario, cantidad} = req.body;
    if (!nombre || !descripcion || !precioUnitario || !cantidad)
      return res.status(400).json({ message: "Incomplet values" });
    let product = {
      nombre,
      descricion,
      precioUnitario,
      cantidad,
    };
    let result = await productsModel.create(product);
    return res.json({
      message: "create new product successfully",
      product: result,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: products.routes.js:56 ~ router.post ~ error:",
      error
    );
    return res.status(500).json({ ok: false, message: error.message });
  }
});

router.put("/:sid", async (req, res) => {
  const id = req.params.sid;
  const UpdateProduct = req.body;
  console.log(
    "🚀 ~ file: products.routes.js:67 ~ router.put ~ UpdateProducts:",
    UpdateProduct
  );

  let result = await productsModel.updateOne(
    { _id: id },
    { $set: UpdateProduct }
  );
  return res.json({
    message: `getProductById ${id} succesfully`,
    product: result,
  });
});

router.delete("/:sid", async (req, res) => {
  const id = req.params.sid;
  let result = await productsModel.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.json({
      message: `deleteProductsById with productId ${id}, it's already deleted`,
    });
  }
  return res.json({
    message: `deleteProductById ${id} succesfully`,
    product: result,
  });
});

router.get("/:sid", async (req, res) => {
  const { sid } = req.params;

  // {
  //   _id: sid;
  // }
  let product = await productsModel.findById(sid);

  if (!product) {
    return res.json({
      message: " this product does not exist",
    });
  }

  return res.json({
    message: `product with id ${sid}`,
    product,
  });
});

module.exports = router;