const mongoose = require("mongoose");

const EnderecoSchema = new mongoose.Schema({
    cep: { type: String, required: true },
    uf: { type: String, required: true },
    cidade: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: Number, required: true },
    complemento: { type: Date, required: false },
});

module.exports = mongoose.model("Endereco", EnderecoSchema);
