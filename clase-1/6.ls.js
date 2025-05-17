/* const fs = require('node:fs');

fs.readdir('.',(err, files)=>{
    if (err) {
        console.error('Error al leer el directorio')
        return;
    }
    files.forEach(file => {
        console.log(file)
    });
}) */

const fs = require('node:fs/promises');

//fs.stat('content');

fs.readdir('.')
.then(files =>{
    files.forEach(file => {
        console.log(file)
    })
})
.catch(err => {
    if (err) {
        console.error('Error al leer el directorio')
        return;
    }
})