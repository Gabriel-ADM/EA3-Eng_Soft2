const mongoose = require("mongoose");

const SinistroSchema = new mongoose.Schema({
    assegurado: { type: String, required: true },
    localizacao: { type: String, required: true },
    envolvidosNome: { type: [String], required: false },
    veiculoEnvolvidos: { type: [String], required: false },
    animaisEnvolvidos: { type: [String], required: false },
    descricao: { type: String, required: false },
});

module.exports = mongoose.model("Sinistro", SinistroSchema);
