const express = require('express')
const cors = require('cors')

const api = express()

// ====================================
// MIDDLEWARES
// ====================================

api.use(express.json())
api.use(cors())

// ====================================
// BANCO FAKE
// ====================================

const usuarios = []
const iot_data = []
const devices = []

let sensorId = 0

// ====================================
// ROTAS USUÁRIOS
// ====================================

// LISTAR USUÁRIOS
api.get('/usuarios', (req, res) => {

    return res.status(200).json(usuarios)
})

// CRIAR USUÁRIO
api.post('/usuarios', (req, res) => {

    console.log(req.body)

    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {

        return res.status(400).json({
            msg: 'Todos os campos são obrigatórios'
        })
    }

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha
    }

    usuarios.push(novoUsuario)

    return res.status(201).json({
        msg: 'Usuário criado com sucesso',
        usuario: novoUsuario
    })
})

// EDITAR USUÁRIO
api.put('/usuarios/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = usuarios.findIndex(
        usuario => usuario.id === id
    )

    if (index === -1) {

        return res.status(404).json({
            msg: 'Usuário não encontrado'
        })
    }

    usuarios[index] = {
        id,
        ...req.body
    }

    return res.status(200).json({
        msg: 'Usuário atualizado',
        usuario: usuarios[index]
    })
})

// DELETAR USUÁRIO
api.delete('/usuarios/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = usuarios.findIndex(
        usuario => usuario.id === id
    )

    if (index === -1) {

        return res.status(404).json({
            msg: 'Usuário não encontrado'
        })
    }

    usuarios.splice(index, 1)

    return res.status(200).json({
        msg: 'Usuário deletado'
    })
})

// ====================================
// ROTAS IOT
// ====================================

// LISTAR SENSORES
api.get('/iot', (req, res) => {

    return res.status(200).json(iot_data)
})

// BUSCAR SENSOR
api.get('/sensor/:id', (req, res) => {

    const sensor = iot_data.find(
        item => item.id === parseInt(req.params.id)
    )

    if (!sensor) {

        return res.status(404).json({
            msg: 'Sensor não encontrado'
        })
    }

    return res.status(200).json(sensor)
})

// CRIAR SENSOR
api.post('/newData', (req, res) => {

    console.log(req.body)

    const {
        temperatura,
        pressao,
        umidade,
        sensor_presenca,
        trava_seguranca
    } = req.body

    sensorId++

    const newData = {
        id: sensorId,
        temperatura,
        pressao,
        umidade,
        sensor_presenca,
        trava_seguranca
    }

    iot_data.push(newData)

    return res.status(201).json({
        msg: 'Dados recebidos com sucesso!',
        data: newData
    })
})

// EDITAR SENSOR
api.put('/sensor/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = iot_data.findIndex(
        item => item.id === id
    )

    if (index === -1) {

        return res.status(404).json({
            msg: 'Sensor não encontrado'
        })
    }

    iot_data[index] = {
        id,
        ...req.body
    }

    return res.status(200).json({
        msg: 'Sensor atualizado!',
        sensor: iot_data[index]
    })
})

// ====================================
// ROTAS DEVICES
// ====================================

// LISTAR DEVICES
api.get('/devices', (req, res) => {

    return res.status(200).json(devices)
})

// CRIAR DEVICE
api.post('/devices', (req, res) => {

    console.log(req.body)

    const { nome, tipo } = req.body

    if (!nome || !tipo) {

        return res.status(400).json({
            msg: 'Nome e tipo são obrigatórios'
        })
    }

    const novoDevice = {
        id: devices.length + 1,
        nome,
        tipo
    }

    devices.push(novoDevice)

    return res.status(201).json({
        msg: 'Device criado com sucesso',
        device: novoDevice
    })
})

// EDITAR DEVICE
api.put('/devices/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = devices.findIndex(
        device => device.id === id
    )

    if (index === -1) {

        return res.status(404).json({
            msg: 'Dispositivo não encontrado'
        })
    }

    devices[index] = {
        id,
        ...req.body
    }

    return res.status(200).json({
        msg: 'Dispositivo atualizado',
        device: devices[index]
    })
})

// DELETAR DEVICE
api.delete('/devices/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = devices.findIndex(
        device => device.id === id
    )

    if (index === -1) {

        return res.status(404).json({
            msg: 'Dispositivo não encontrado'
        })
    }

    devices.splice(index, 1)

    return res.status(200).json({
        msg: 'Dispositivo deletado'
    })
})

// ====================================
// SERVIDOR
// ====================================

const porta = 8080

api.listen(porta, () => {

    console.log(`API rodando na porta ${porta}`)
})