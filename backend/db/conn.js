//IMPORTAR O MONGOOSE
const mongoose = require('mongoose')

//CRIAR A FUNÇÃO PRINCIPAL DE CONEXÃO
async function main(){
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Conectado ao Mongoose')

}
//CHAMAR A FUNÇÃO PARA CONECTAR O DB
main()

//EXPORTAR O MONGOOSE
module.exports = mongoose