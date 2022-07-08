//IMPORTAR O MODEL
const User = require('../models/User')

//IMPORTAR O BCRYPT
const bcrypt = require('bcrypt')

//IMPORTAR O JWT
const jwt = require('jsonwebtoken')

//IMPORTAR O CRIADOR DE TOKEN
const createUserToken = require('../helpers/create-user-token')

//IMPORTAR A FUNÇÃO HELPER QUE OBTEM O TOKEN
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

//EXPORTAR A CLASSE COM AS FUNÇÕES DE CALLBACK
module.exports = class UserController{

    static async register(req, res){
        
        //RECEBER OS VALORES QUE VEM DO CORPO DA REQUISIÇÃO
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword


        if(req.file){

            user.image = req.file.filename
        }

        //FAZER AS VALIDAÇÕES DE EXISTÊNCIA
        if(!name){
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }

        if(!email){
            res.status(422).json({message: "O email é obrigatório!"})
            return
        }

        if(!phone){
            res.status(422).json({message: "O phone é obrigatório!"})
            return
        }

        if(!password){
            res.status(422).json({message: "O password é obrigatório!"})
            return
        }

        if(!confirmpassword){
            res.status(422).json({message: "O confirmpassword é obrigatório!"})
            return
        }

        //VALIDAÇÃO DE CONFRIMAÇÃO DE SENHA 
        if(password !== confirmpassword){
            res.status(422).json({message: "Senha precisa ser igual ao confirma senha"})
            return
        }

        //VERIFICAR SE O EMAIL JÁ ESTÁ CADASTRADO NO BANCO
        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: "Email já cadastrado"})
            return
        }

        //PEGAR A SENHA E CRIPTOGRAFA-LA - AUMENTAR A STRING COM SALT - CRIAR O PASSWORDHASH
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //MODELAR O USUÁRIO E CRIAR O OBJETO
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
           
        })

        //SALVAR O USUARIO NO BANCO DE DADOS
        try{

            const newuser = await user.save()

            await createUserToken(newuser, req, res)
           

        }catch(error){
            res.status(500).json({message: error})
        }


    }

    //CRIAR A FUNÇÃO DE CALLBAK QUE FAZ O LOGIN
    static async login(req, res){

        //RECEBER O EMAIL E A SENHA PELO FORMULÁRIO NO CORPO DA REQUISIÇÃO
        const email = req.body.email
        const password = req.body.password

        //FAZER A VALIDAÇÃO DE EXISTENCIA DA VAIRÁVEL
        if(!password){
            res.status(422).json({message: "O password é obrigatório!"})
            return
        }

        if(!email){
            res.status(422).json({message: "O email é obrigatório!"})
            return
        }

        //VERIFICAR SE O USUARIO EXISTE NO BANCO DE DADOS
        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: "O usuário não está cadastrado!"})
            return
        }

        //VERIFICAR SE A SENHA DO USUÁRIO É A MESMA DO BANCO DE DADOS
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: "Senha inválida!"})
            return
        }

        //CHAMAR O TOKEN
        await createUserToken(user, req, res)
    }

    //FUNÇÃO PARA OBTER O USUÁRIO ATRAVES DO TOKEN
    static async checkUser(req, res){

        //VARIAVEL NÃO DEFINIDA DO USUARIO
        let currentUser

        if(req.headers.authorization){

            //CHAMAR A FUNÇÃO HELPER QUE VAI DECODIFICAR O TOKEN
            const token = getToken(req)

            //DECODIFICAR O TOKEN / NÃO ESQUECER DE PASSAR O SECRET
            const decode = jwt.verify(token, 'nossosecreet')

            //VERIFICAR NO BANCO O USUARIO COM ESSE TOKEN
            currentUser = await User.findById(decode.id)

            //REMOVER A SENHA DO RETORNO
            currentUser.password = undefined

        }else{

            currentUser = null
        }

        //ENVIAR O DEVIDO USUARIO
        res.status(200).send(currentUser)

    }

    //FUNÇÃO CALLBACK PARA OBTER DO USUÁRIO
    static async getUserById(req, res){

        //OBTER O ID ATRAVÉS DOS PARAMETROS DE URI
        const id = req.params.id

        //ENCONTRAR NO BANCO O USUÁRIO COM ESSE ID
        const user = await User.findById(id).select('-password')

        //VERIFICAR SE O USUÁRIO FOI ENCONTRADO
        if(!user){
            res.status(422).json({message: "O usuário não está cadastrado!"})
            return
        }

        res.status(200).json({user})


    }

    //FUNÇAO CALLBAK PARA EDITAR USUARIO
    static async editUser(req, res){

        //obter o id da requisição
        const id = req.params.id

        //encontrar o usuario no banco de dados
        const token = getToken(req)
        const user = await getUserByToken(token)

        //RECEBER OS VALORES QUE VEM DO CORPO DA REQUISIÇÃO
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        //atualizar a imagem

        let image = ''

      

        //FAZER AS VALIDAÇÕES DE EXISTÊNCIA
        if(!name){
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }

        if(!email){
            res.status(422).json({message: "O email é obrigatório!"})
            return
        }

        //encontrar o usuario com um email usado para evitar duplicidade
        const userExits = await User.findOne({email: email})

        //verificar se o email do usuario é diferente do editado e se tem um outro usuario com esse email
        if(user.email !== email && userExits){
            res.status(422).json({message: "O usuário não está cadastrado!"})
            return
        }

        //atualizar a variavel de emal
        user.email = email

        if(!phone){
            res.status(422).json({message: "O phone é obrigatório!"})
            return
        }

        user.phone = phone

        if(password !== confirmpassword){

            res.status(422).json({message: "A senha é diferente da confirmação!"})
            return

        }else if(password === confirmpassword && password != null){

            //PEGAR A SENHA E CRIPTOGRAFA-LA - AUMENTAR A STRING COM SALT - CRIAR O PASSWORDHASH
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try{

            await User.findOneAndUpdate(
                { _id: user.id},
                {$set: user},
                {new: true}
            )

            res.status(200).json({message: "Usuario atualizado"})

        }catch(err){

            res.status(500).json({message: err})
            return

        }

            

       



    }
}