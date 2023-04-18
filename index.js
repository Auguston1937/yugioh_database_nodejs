const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const data = require('./data/data_pt.json')
const staples = require('./data/staples_pt.json')
const cors = require('cors')
const fs = require("fs").promises;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.listen(3000, () => console.log('A API está funcionando!'))

app.get('/', async (req, res) => {
    let nomeDesc  = req.query['nomeDesc']
    let tipo  = req.query['type']
    let level  = req.query['level']
    let atributo  = req.query['attribute']
    let race  = req.query['race']
    var response = data.data

    if(typeof(nomeDesc) !== 'undefined' && nomeDesc !== '') 
        response = data.data.filter(x => x.name.toUpperCase().includes(nomeDesc.toUpperCase()) | x.desc.toUpperCase().includes(nomeDesc.toUpperCase()) | x.name_en.toUpperCase().includes(nomeDesc.toUpperCase()))
    if(typeof(tipo) !== 'undefined' && tipo !== ''){
        response = response.filter(x => typeof(x.type) !== 'undefined' && x.type.toUpperCase().includes(tipo.toUpperCase()))
    }
    if(typeof(level) !== 'undefined' && level !== ''){
        response = response.filter(x => typeof(x.level) !== 'undefined' && x.level == level)
    }
    if(typeof(atributo) !== 'undefined' && atributo !== ''){
        response = response.filter(x => typeof(x.attribute) !== 'undefined' && x.attribute.toUpperCase().includes(atributo.toUpperCase()))
    }
    if(typeof(race) !== 'undefined' && race !== ''){
        response = response.filter(x => typeof(x.race) !== 'undefined' && x.race.toUpperCase().includes(race.toUpperCase()))
    }
    if(typeof(archetype) !== 'undefined' && archetype !== ''){
        response = response.filter(x => typeof(x.archetype) !== 'undefined' && x.archetype.toUpperCase().includes(archetype.toUpperCase()))
    }
    
    res.status(200)
    res.send(response)
})

app.get('/arquetipos', async (req, res) => {
    let response
    let arquetipo = req.query['arquetipo']
    if(typeof(arquetipo) === 'undefined'){
        response = await Promise.all(new Set(data.data.map(x => x.archetype).filter(x => typeof(x) !== 'undefined' && x !== null)))
    } else {
        response = await Promise.all(data.data.filter(x => typeof(x.archetype) !== 'undefined' && x.archetype.toUpperCase().includes(arquetipo.toUpperCase())))
    }
    res.status(200)
    res.send(response)
})

app.get('/staples', async (req, res) => {
    let response = staples.data
    let nomeDesc  = req.query['nomeDesc']
    let tipo  = req.query['type']
    let level  = req.query['level']
    let atributo  = req.query['attribute']
    let race  = req.query['race']


    if(typeof(nomeDesc) !== 'undefined' && nomeDesc !== '') 
        response = response.filter(x => x.name.toUpperCase().includes(nomeDesc.toUpperCase()) | x.desc.toUpperCase().includes(nomeDesc.toUpperCase()) | x.name_en.toUpperCase().includes(nomeDesc.toUpperCase())
        )
    if(typeof(tipo) !== 'undefined' && tipo !== ''){
        response = response.filter(x => typeof(x.type) !== 'undefined' && x.type.toUpperCase().includes(tipo.toUpperCase()))
    }
    if(typeof(level) !== 'undefined' && level !== ''){
        response = response.filter(x => typeof(x.level) !== 'undefined' && x.level == level)
    }
    if(typeof(atributo) !== 'undefined' && atributo !== ''){
        response = response.filter(x => typeof(x.attribute) !== 'undefined' && x.attribute.toUpperCase().includes(atributo.toUpperCase()))
    }
    if(typeof(race) !== 'undefined' && race !== ''){
        response = response.filter(x => typeof(x.race) !== 'undefined' && x.race.toUpperCase().includes(race.toUpperCase()))
    }
    if(typeof(archetype) !== 'undefined' && archetype !== ''){
        response = response.filter(x => typeof(x.archetype) !== 'undefined' && x.archetype.toUpperCase().includes(archetype.toUpperCase()))
    }

    res.status(200)
    res.send(response)
})

app.get('/filtros', async (req, res) => {
    let tipos = await Promise.all(new Set(data.data.map(x => x.type).filter(x => typeof(x) !== 'undefined' && x !== null)))
    let leveis = await Promise.all(new Set(data.data.map(x => x.level).filter(x => typeof(x) !== 'undefined' && x !== null)))
    let atributos = await Promise.all(new Set(data.data.map(x => x.attribute).filter(x => typeof(x) !== 'undefined' && x !== null)))
    let racas = await Promise.all(new Set(data.data.map(x => x.race).filter(x => typeof(x) !== 'undefined' && x !== null)))
    let filtros = {
        tipos: tipos,
        leveis: leveis,
        atributos: atributos,
        racas: racas,
    }
    res.status(200)
    res.send(filtros)
})

app.get('/decks', async (req, res) => {
    // console.log('chamou')
    let response = []
    let decks = await fs.readdir('./decks');
    decks.forEach(x => {
        response.push(x.replace('.json', ''))
    })
    res.status(200).send(response)
})

app.get('/decks/:deck', async (req, res) => {
    let response
    let deck = req.params['deck']
    let decks = await fs.readdir('./decks');
    decks.forEach(x => {
        if(x.toUpperCase().includes(deck.toUpperCase())){
            response = require('./decks/'+ x)
        }

    })
    res.status(200).send(response)
})

app.put('/deck/:deck', async (req, res) => {
    // 13650422, 12071500, 18094166, 86165817
    let deck = req.params['deck']
    let body = req.body
    let cartas = []
    body.forEach(carta => {
        cartas.push(data.data.filter(x => x.id == carta))
    })
    fs.writeFile('./decks/' + deck + '.json', JSON.stringify(cartas), err => {
        if (err) throw err; 
    })
    res.status(200).send()
    
})