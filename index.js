const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./dados.db');

// Middleware
app.use(cors());
app.use(express.json());

// Criação da tabela
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    cep TEXT,
    rua TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT
  )
`);

// Rota para receber dados
app.post('/enviar', (req, res) => {
  const {
    nome, email, telefone, cep, rua, numero,
    complemento, bairro, cidade, estado
  } = req.body;

  const query = `
    INSERT INTO usuarios (
      nome, email, telefone, cep, rua, numero,
      complemento, bairro, cidade, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    nome, email, telefone, cep, rua, numero,
    complemento, bairro, cidade, estado
  ], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao salvar no banco de dados' });
    }
    res.status(200).json({ mensagem: 'Dados salvos com sucesso!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
