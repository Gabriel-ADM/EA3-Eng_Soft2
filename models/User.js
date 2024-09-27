const mongoose = require("mongoose");
const EnderecoSchema = require('./Endereco').schema;

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    dataNascimento: { type: Date, required: false },
    endereco: { type: EnderecoSchema, required: false }
});

module.exports = mongoose.model('User', UserSchema);
