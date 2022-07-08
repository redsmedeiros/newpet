//IMPORTAR A BIBLIOTECA PREINCIPAL OU EXPRESS
const express = require('express')

//IMPORTAR ROTAS
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

//IMPORTAR O CORS PARA RESOLVER CONFLITO DE SERVIDOR
const cors = require('cors')

//CRIAR O OBJETO DE APLICAÇÃO PRINCIPAL
const app = express()

//CONFIGURAR O JSON DE RESPOSTA
app.use(express.json())

//CONFIGURAR O CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//CONFIGURAR A PASTA DE IMAGENS
app.use(express.static('public'))

//ROTAS
app.use('/users', UserRoutes)
app.use('/pets/', PetRoutes)

//DEFINIR A PORTA QUE VAI ESCUTAR O BACKEND
app.listen(5000)
