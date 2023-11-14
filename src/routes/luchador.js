const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('../files');
const {models} = require('../libs/sequelize');

const FILE_NAME = './db/UFC.txt';


//WEB
// Listar Luchadores
router.get('/', async (req, res)=>{
    // let luchador = readFile(FILE_NAME);

    const {search} = req.query;

    // if(search){
    //     luchador = luchador.filter(
    //         luchador => luchador.name.toLowerCase().includes(search.toLowerCase())
    //         );
    // }
    //Consulta CRUDA (Raw Query)
    //const [luchador, metadata] = await sequelize.query('SELECT * FROM luchador');
    //console.log('luchador: ', luchador);
    //console.log('metadata: ',metadata);
    //Consulta con Sequelize
    let luchador = await models.Luchador.findAll();
    res.render('luchador/index', { luchador: luchador, search: search });
});

//Crear Mascota
router.get('/create', (req, res)=>{
    //Mostrar el formulario
    res.render('luchador/create');
});

router.post('/', async (req, res) => {
    try {
        //Leer el archivo de mascotas
        // const data = readFile(FILE_NAME);
        // //Agregar la nueva mascota (Agregar ID)
        // const newUfc = req.body;
        // newUfc.id = uuidv4();
        // console.log(newUfc)
        // data.push(newUfc);
        // // Escribir en el archivo
        // writeFile(FILE_NAME, data);
        const newUfc = await models.Luchador.create(req.body);
        res.redirect('/luchador');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

//Eliminar una mascota
router.post('/delete/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    // //Leer el contenido del archivo
    // const luchador = readFile(FILE_NAME)
    // // Buscar la mascota con el ID que recibimos
    // const ufcIndex = luchador.findIndex(luchador => luchador.id === id )
    // if( ufcIndex < 0 ){// Si no se encuentra la mascota con ese ID
    //     res.status(404).json({'ok': false, message:"Luchador not found"});
    //     return;
    // }
    // //Eliminar la mascota que esté en la posición ufcIndex
    // luchador.splice(ufcIndex, 1);
    // writeFile(FILE_NAME, luchador)
    models.Luchador.destroy({
        where: {
            id: id
        }
    });
    res.redirect('/luchador');
})

module.exports = router;