const mongoose = require("mongoose");

const VeiculoSchema = new mongoose.Schema({
    placa: { type: String, required: true },
    cor: { type: String, required: false },
    modelo: { type: String, required: false },
    assegurado: { type: Boolean, required: true },
});

module.exports = mongoose.model('Veiculo', VeiculoSchema);