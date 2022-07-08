//importar o express de rotas
const router = require('express').Router()

//importar o devido controller
const PetController = require('../controllers/PetController')

//criar o middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//criar a rota de pets
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

router.get('/', PetController.getAll)

router.get('/mypets', PetController.getAllUserPets)

router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)

router.get('/:id', PetController.getPetById)

router.delete('/:id', verifyToken, PetController.removePetById)

router.patch('/:id', verifyToken, imageUpload.array('images', PetController.updatePet))

//exportar a rota
module.exports = router