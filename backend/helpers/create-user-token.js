//IMPORTAR O JSONWEBTOKEN
const jwt = require('jsonwebtoken')

//CRIAR A FUNÇÃO QUE IRÁ CRIAR O TOKEN
const createUserToken = async(user, req, res) => {

    //PASSAR AS INFORMAÇÕES QUE SERÃO ENVIADAS JUNTO COM O TOKEN - COLOCAR O SECRET PARA COMPLICAR A SENHA
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecreet")

    //RETORNAR O TOKEN
    res.status(200).json({
        message: "Você está auntenticado",
        token: token,
        userId: user._id
    })

}

//EXPORTAR A FUNÇÃO
module.exports = createUserToken