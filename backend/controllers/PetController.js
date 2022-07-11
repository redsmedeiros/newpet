//importar o model com as defnições da tabela e com as devidas funções
const Pet = require('../models/Pet')

//importar o helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

//exportar a classe de controller
module.exports = class PetController{

    //função de criar o pet
    static async create(req, res){
        
        //pegar os dados vindo do corpo da requisição
        const name = req.body.name
        const age = req.body.age
        const weight = req.body.weight
        const color = req.body.color

        const images = req.files

        const available = true

        //fazer as validações do campo
        if(!name){
            res.status(422).json({message: "nome é obrigatório!"})
            return
        }

        if(!age){
            res.status(422).json({message: "idade é obrigatório!"})
            return
        }

        if(!weight){
            res.status(422).json({message: "peso é obrigatório!"})
            return
        }

        if(!color){
            res.status(422).json({message: "cor é obrigatório!"})
            return
        }

        if(images.length === 0){
            res.status(422).json({message: "imagem é obrigatório!"})
            return
        }

        //obter o usuario que cadastrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        //instanciar o objeto do pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }

        })

        //usar o map para percorrer o array de images
        images.map( (image) => {

            //colocar o nome da imagem no array
            pet.images.push(image.filename)

        })

        //salvar o pet no banco
        try{

            const newPet = await pet.save()

            res.status(201).json({
                message: "Pet salvo",
                newPet
            })

        }catch(error){

            res.status(500).json({message: error})
        }

    }

    //função para obter os pets
    static async getAll( req, res){

        //trazer todos os pets
        const pets = await Pet.find().sort("-createdAt")

        res.status(200).json({ pets: pets})

    }

    //função para obter os pets do usuario
    static async getAllUserPets(req, res){

        //obter o usuario atraves do tokens
        const token = getToken(req)
        const user = await getUserByToken(token)

        //criar um array com os pets do usuario
        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    //função para obter os pets que eu desjo
    static async getAllUserAdoptions(req, res){

        //obter o usuario atraves do tokens
        const token = getToken(req)
        const user = await getUserByToken(token)

        //criar um array com os pets do usuario
        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})

    }

    //função para obter o pet por id
    static async getPetById(req, res){

        //ober o id pelos parametros de url
        const id = req.params.id

        //checar se é um object id valido
        if(!ObjectId.isValid(id)){
            res.status(422).json({message: "ID inválido"})
            return
        }

        //achar um pet com esse id no banco
        const pet = await Pet.findOne({_id: id})

        //verficiar se o pet existe
        if(!pet){
            res.status(404).json({ message: "pet não encontrado!"})
        }

        //enviar o pet selecionado
        res.status(200).json({pet: pet})



    }

    //deletar o pet por ID
    static async removePetById(req, res){

        //pegar o id pela url traves dos paramentros
        const id = req.params.id

         //checar se é um object id valido
         if(!ObjectId.isValid(id)){
            res.status(422).json({message: "ID inválido"})
            return
        }

        //achar um pet com esse id no banco
        const pet = await Pet.findOne({_id: id})

        //verficiar se o pet existe
        if(!pet){
            res.status(404).json({ message: "pet não encontrado!"})
            return
        }

        //verificar se o registrado logado registrou o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){

            res.status(422).json({ message: "Solicitação não processada!"})
            return
        }

        //deletar o pet
        await Pet.findOneAndRemove(id)

        res.status(200).json({message: "Pet removido com sucesso!"})



    }

    static async updatePet(req, res){

         //pegar o id pela url traves dos paramentros
         const id = req.params.id

        //pegar os dados vindo do corpo da requisição
        const name = req.body.name
        const age = req.body.age
        const weight = req.body.weight
        const color = req.body.color
        const available = req.body.available

        const images = req.files

        const updateData = {}

        //achar um pet com esse id no banco
        const pet = await Pet.findOne({_id: id})

        //verficiar se o pet existe
        if(!pet){
            res.status(404).json({ message: "pet não encontrado!"})
            return
        }

          //verificar se o registrado logado registrou o usuário
          const token = getToken(req)
          const user = await getUserByToken(token)
  
          if(pet.user._id.toString() !== user._id.toString()){
  
              res.status(422).json({ message: "Solicitação não processada!"})
              return
          }

          //fazer as validações do campo
        if(!name){
            res.status(422).json({message: "nome é obrigatório!"})
            return
        }else{
            updateData.name = name
        }

        if(!age){
            res.status(422).json({message: "idade é obrigatório!"})
            return
        }else{
            updateData.age = age
        }

        if(!weight){
            res.status(422).json({message: "peso é obrigatório!"})
            return
        }else{
            updateData.weight = weight
        }

        if(!color){
            res.status(422).json({message: "cor é obrigatório!"})
            return
        }else{
            updateData = color
        }

        if(images.length === 0){
            res.status(422).json({message: "imagem é obrigatório!"})
            return
        }else{
            updateData.images = []

            images.map( (image) => {updateData.images.push(image.filename)})
        }

        //realizar a atuação no banco
        await Pet.findByIdAndUpdate(id, updateData)

        res.status(200).json({message: "Pet atualizado com sucesso!"})

             


    }

    static async schedule(req, res){

        //obter o id vindo do paramentro do url
        const id = req.params.id

           //achar um pet com esse id no banco
           const pet = await Pet.findOne({_id: id})

           //verficiar se o pet existe
           if(!pet){
               res.status(404).json({ message: "pet não encontrado!"})
               return
           }

           //verificar se o pet é do usuario

          const token = getToken(req)
          const user = await getUserByToken(token)
  
          if(pet.user._id.equals(user._id)){
  
              res.status(422).json({ message: "Não é possivel agendar visita para o seu próprio pet"})
              return
          }

          //verificar se o usuário já agendou o pet
          if(pet.adopter){
            if(pet.adopter.id_equals(user._id)){

                res.status(422).json({ message: "Pet já agendado!"})
              return

            }
          }

          //adicionar usuario como adotante do pet
          pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
          }

          await Pet.findByIdAndUpdate(id, pet)

          res.status(200).json({ message: `Agendado: entre em contato com ${pet.user.name}, pelo telefone ${pet.user.phone}`})

    }

    static async concludeAdoption(req, res){

            //obter o id vindo do paramentro do url
            const id = req.params.id

            //achar um pet com esse id no banco
             const pet = await Pet.findOne({_id: id})

            //verficiar se o pet existe
            if(!pet){
                res.status(404).json({ message: "pet não encontrado!"})
                return
            }


    }
}

//259 04:00