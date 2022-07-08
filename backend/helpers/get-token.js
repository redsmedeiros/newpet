//CRIAR A FUNÇÃO PARA OBTER O TOKEN
const getToken = (req) => {

    //OBTER O TOKEN NO HEADER
    const authHeader = req.headers.authorization

    //USAR O SPLIT PARA ONDE TIVER ESPAÇO CRIAR UM ARRAY E PEGAR A SEGUNDA PARTE DO ARRAY ONDE TEM O TOKEN
    const token = authHeader.split(" ")[1]

    return token

}

//EXPORTAR A FUNÇÃO
module.exports = getToken