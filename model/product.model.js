const mongoose = require("mongoose");

const collectionName = "Productos";

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripion: {
    type: String,
    required: true,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
});

const productosModel = mongoose.model(collectionName, productSchema);
module.exports = productosModel;