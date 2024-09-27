const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose')

const port = 8080;
const app = express();

const mongoConfig = {
    user: "sinistro-backend",
    password: "j9d7e3QZEp9HqdVw",
    connectionParams: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
}

const mongoConnectionStr = `mongodb+srv://${mongoConfig.user}:${mongoConfig.password}@cluster0.cbfqakg.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoConnectionStr)
    .then(() => {
        console.log("Banco de Dados conectado!");
    })
    .catch((err) => {
        console.log("Banco de Dados não conectado, erro: ", err);
    });

// Models
const UserModel = require('./models/User');
const SinistroModel = require('./models/Sinistro');
const VeiculoModel = require('./models/Veiculo');
const EnderecoModel = require('./models/Endereco');
const ErrorModel = require('./models/Error');

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    return res.status(200).send("Servidor rodando com sucesso!");
});

app.post("/usuario", async (req, res) => {
    try {
        const user = req.query;
        const dbUser = await UserModel.create(({
            nome: user.nome,
            cpf: user.cpf,
            email: user.email,
            telefone: user.telefone,
            placa: user.placa,
            dataNascimento: user.dataNascimento,
        }))

        return res.status(201).send({ mes: "Usuário cadastrado com sucesso", usuario: dbUser });
    } catch (err) {
        console.log(err);
        registerError(err)
        const errMessage = "Ocorreu um erro ao cadastrar usuário.";
        return res.status(400).send({ mes: errMessage, erro: err });
    }
})

app.put("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = req.body;

        const dbUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                nome: user.nome,
                cpf: user.cpf,
                email: user.email,
                telefone: user.telefone,
                placa: user.placa,
                dataNascimento: user.dataNascimento,
            },
            { new: true }
        );

        if (!dbUser) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Usuário atualizado com sucesso", usuario: dbUser });
    } catch (err) {
        console.log(err);
        registerError(err);
        const errMessage = "Ocorreu um erro ao atualizar o usuário.";
        return res.status(400).send({ mes: errMessage, erro: err });
    }
});

app.post("/user/login", async (req, res) => {
    try {
        const { cpf, email } = req.body;

        const dbUser = await UserModel.findOneAndUpdate(
            { cpf, email },
            { new: true }
        );

        if (!dbUser) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Login atualizado com sucesso", usuario: dbUser });
    } catch (err) {
        console.log(err);
        registerError(err);
        return res.status(400).send({ mes: "Ocorreu um erro ao atualizar login.", erro: err });
    }
});

app.post("/user/:id/phone", async (req, res) => {
    try {
        const { phone } = req.body;
        const userId = req.params.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { telefone: phone } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Telefone adicionado com sucesso", usuario: updatedUser });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao adicionar telefone.", erro: err });
    }
});

app.get("/user/:id/phone", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Telefones listados com sucesso", telefones: user.telefone });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao listar telefones.", erro: err });
    }
});

app.post("/user/:id/email", async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.params.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Email atualizado com sucesso", usuario: updatedUser });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao atualizar email.", erro: err });
    }
});

app.get("/user/:id/email", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Email obtido com sucesso", email: user.email });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter email.", erro: err });
    }
});

app.post("/user/:id/endereco", async (req, res) => {
    try {
        const { endereco } = req.body;
        const userId = req.params.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { endereco },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Endereço atualizado com sucesso", usuario: updatedUser });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao atualizar endereço.", erro: err });
    }
});

app.get("/user/:id/endereco", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ mes: "Usuário não encontrado." });
        }

        return res.status(200).send({ mes: "Endereço obtido com sucesso", endereco: user.endereco });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter endereço.", erro: err });
    }
});

app.post("/veiculo", async (req, res) => {
    try {
        const { placa, cor, modelo, assegurado } = req.body;

        const newVeiculo = new VeiculoModel({
            placa,
            cor,
            modelo,
            assegurado,
        });

        const dbVeiculo = await newVeiculo.save();

        return res.status(201).send({ mes: "Veículo cadastrado com sucesso", veiculo: dbVeiculo });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao cadastrar veículo.", erro: err });
    }
});

app.get("/veiculo/:id", async (req, res) => {
    try {
        const veiculoId = req.params.id;

        const veiculo = await VeiculoModel.findById(veiculoId);

        if (!veiculo) {
            return res.status(404).send({ mes: "Veículo não encontrado." });
        }

        return res.status(200).send({ mes: "Veículo obtido com sucesso", veiculo });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter veículo.", erro: err });
    }
});

app.get("/veiculo/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const veiculos = await VeiculoModel.find({ userId });

        if (!veiculos.length) {
            return res.status(404).send({ mes: "Nenhum veículo encontrado para este usuário." });
        }

        return res.status(200).send({ mes: "Veículos listados com sucesso", veiculos });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao listar veículos.", erro: err });
    }
});

app.delete("/veiculo/:id", async (req, res) => {
    try {
        const veiculoId = req.params.id;

        const dbVeiculo = await VeiculoModel.findByIdAndDelete(veiculoId);

        if (!dbVeiculo) {
            return res.status(404).send({ mes: "Veículo não encontrado." });
        }

        return res.status(200).send({ mes: "Veículo excluído com sucesso", veiculo: dbVeiculo });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao excluir veículo.", erro: err });
    }
});

app.put("/veiculo/:id", async (req, res) => {
    try {
        const veiculoId = req.params.id;
        const { placa, cor, modelo, assegurado } = req.body;

        const updatedVeiculo = await VeiculoModel.findByIdAndUpdate(
            veiculoId,
            { placa, cor, modelo, assegurado },
            { new: true }
        );

        if (!updatedVeiculo) {
            return res.status(404).send({ mes: "Veículo não encontrado." });
        }

        return res.status(200).send({ mes: "Veículo atualizado com sucesso", veiculo: updatedVeiculo });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao atualizar veículo.", erro: err });
    }
});

app.get("/sinistro/:id", async (req, res) => {
    try {
        const sinistroId = req.params.id;

        const sinistro = await SinistroModel.findById(sinistroId);

        if (!sinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Sinistro obtido com sucesso", sinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter sinistro.", erro: err });
    }
});

app.post("/sinistro", async (req, res) => {
    try {
        const { assegurado, localizacao, envolvidosNome, veiculoEnvolvidos, animaisEnvolvidos, descricao } = req.body;

        const newSinistro = new SinistroModel({
            assegurado,
            localizacao,
            envolvidosNome,
            veiculoEnvolvidos,
            animaisEnvolvidos,
            descricao,
        });

        const dbSinistro = await newSinistro.save();

        return res.status(201).send({ mes: "Sinistro cadastrado com sucesso", sinistro: dbSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao cadastrar sinistro.", erro: err });
    }
});

app.delete("/sinistro/:id", async (req, res) => {
    try {
        const sinistroId = req.params.id;

        const dbSinistro = await SinistroModel.findByIdAndDelete(sinistroId);

        if (!dbSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Sinistro excluído com sucesso", sinistro: dbSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao excluir sinistro.", erro: err });
    }
});

app.get("/sinistro", async (req, res) => {
    try {
        const sinistros = await SinistroModel.find();

        return res.status(200).send({ mes: "Sinistros listados com sucesso", sinistros });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao listar sinistros.", erro: err });
    }
});

app.post("/sinistro/:id/desc", async (req, res) => {
    try {
        const sinistroId = req.params.id;
        const { descricao } = req.body;

        const updatedSinistro = await SinistroModel.findByIdAndUpdate(
            sinistroId,
            { descricao },
            { new: true }
        );

        if (!updatedSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Descrição atualizada com sucesso", sinistro: updatedSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao atualizar descrição.", erro: err });
    }
});

app.post("/sinistro/:id/loc", async (req, res) => {
    try {
        const sinistroId = req.params.id;
        const { localizacao } = req.body;

        const updatedSinistro = await SinistroModel.findByIdAndUpdate(
            sinistroId,
            { localizacao },
            { new: true }
        );

        if (!updatedSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Localização atualizada com sucesso", sinistro: updatedSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao atualizar localização.", erro: err });
    }
});

app.get("/sinistro/:id/loc", async (req, res) => {
    try {
        const sinistroId = req.params.id;

        const sinistro = await SinistroModel.findById(sinistroId);

        if (!sinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Localização obtida com sucesso", localizacao: sinistro.localizacao });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter localização.", erro: err });
    }
});

app.get("/sinistro/:id/envolvido", async (req, res) => {
    try {
        const sinistroId = req.params.id;

        const sinistro = await SinistroModel.findById(sinistroId);

        if (!sinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Envolvidos obtidos com sucesso", envolvidosNome: sinistro.envolvidosNome });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter envolvidos.", erro: err });
    }
});

app.post("/sinistro/:id/envolvido", async (req, res) => {
    try {
        const sinistroId = req.params.id;
        const { envolvidosNome } = req.body;

        const updatedSinistro = await SinistroModel.findByIdAndUpdate(
            sinistroId,
            { $push: { envolvidosNome: { $each: envolvidosNome } } },
            { new: true }
        );

        if (!updatedSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Envolvidos adicionados com sucesso", sinistro: updatedSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao adicionar envolvidos.", erro: err });
    }
});

app.post("/sinistro/:id/veiculo", async (req, res) => {
    try {
        const sinistroId = req.params.id;
        const { veiculoPlacas } = req.body;

        const updatedSinistro = await SinistroModel.findByIdAndUpdate(
            sinistroId,
            { $push: { veiculoEnvolvidos: { $each: veiculoPlacas } } },
            { new: true }
        );

        if (!updatedSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Veículos adicionados com sucesso", sinistro: updatedSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao adicionar veículos.", erro: err });
    }
});

app.get("/sinistro/:id/veiculo", async (req, res) => {
    try {
        const sinistroId = req.params.id;

        const sinistro = await SinistroModel.findById(sinistroId);

        if (!sinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Veículos obtidos com sucesso", veiculos: sinistro.veiculoEnvolvidos });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao obter veículos.", erro: err });
    }
});

app.delete("/sinistro/:id/veiculo", async (req, res) => {
    try {
        const sinistroId = req.params.id;
        const { veiculoPlaca } = req.body;

        const updatedSinistro = await SinistroModel.findByIdAndUpdate(
            sinistroId,
            { $pull: { veiculoEnvolvidos: veiculoPlaca } },
            { new: true }
        );

        if (!updatedSinistro) {
            return res.status(404).send({ mes: "Sinistro não encontrado." });
        }

        return res.status(200).send({ mes: "Veículo excluído com sucesso", sinistro: updatedSinistro });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mes: "Erro ao excluir veículo.", erro: err });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

            