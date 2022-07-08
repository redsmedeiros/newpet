//IMPORTAR O METODO ROUTER
const router = require('express').Router()

//IMPORTAR O CONTROLLER
const UserController = require('../controllers/UserController')

//importar os middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//CRIAR A ROTA DE POST COM A FUNÇÃO DE CALLBACK
router.post('/register', UserController.register)
router.post('/login', UserController.login)

//CRIAR A ROTA DE GET COM A FUNÇÃO DE CALLBACK
router.get('/checkuser', UserController.checkUser)

//ROTAS DINAMICAS PARA EDIÇÃO
router.get('/:id', UserController.getUserById )
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser)

//EXPORTAR O ROUTER
module.exports = router