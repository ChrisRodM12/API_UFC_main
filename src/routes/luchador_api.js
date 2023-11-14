const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('../files');

const FILE_NAME = './db/UFC.txt';

// Rutas de la API
// API
// Listar Mascotas
router.get('/', (req, res)=>{
    let luchador = readFile(FILE_NAME);

    const {search} = req.query;
    if(search){
        luchador = luchador.filter(newufc => luchador.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json(luchador);
})

//Crear Mascota
router.post('/', (req, res) => {
    try {
        //Leer el archivo de mascotas
        const data = readFile(FILE_NAME);
        //Agregar la nueva mascota (Agregar ID)
        const newUfc = req.body;
        newUfc.id = uuidv4();
        console.log(newUfc)
        data.push(newUfc);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ message: 'La mascota fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

//Obtener una sola mascota
router.get('/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const luchador = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const ufcFound = luchador.find(luchador => luchador.id === id )
    if(!ufcFound){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Luchador not found"})
        return;
    }
    res.json({'ok': true, luchador: ufcFound});
})

//Actualizar una mascota
router.put('/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const luchador = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const ufcIndex = luchador.findIndex(luchador => luchador.id === id )
    if( ufcIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Luchador not found"});
        return;
    }
    let ufc = luchador[ufcIndex]; //Sacar del arreglo
    ufc = { ...luchador, ...req.body  };
    luchador[ufcIndex] = luchador; //Poner la mascota en el mismo lugar
    writeFile(FILE_NAME, luchador);
    //Si la mascota existe, modificar sus datos y almacenarlo nuevamente
    res.json({'ok': true, luchador: luchador});
})

//Eliminar una mascota
router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const ufc = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const ufcIndex = ufc.findIndex(luchador => luchador.id === id )
    if( ufcIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Luchador not found"});
        return;
    }
    //Eliminar la mascota que esté en la posición ufcIndex
    ufc.splice(ufcIndex, 1);
    writeFile(FILE_NAME, ufc)
    res.json({'ok': true});
})


module.exports = router;