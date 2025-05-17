import { readFile } from 'node:fs/promises';

Promise.all([
    readFile('./archivo.txt', 'utf-8'),
    readFile('./archivo2.txt', 'utf-8')
]).then(([text,secondText])=>{
    console.log('Primer texto: ', text);
    console.log('Segundo texto: ', secondText);
});

console.log('Leyendo el primer archivo...')
const text = await readFile('./archivo.txt', 'utf-8')
console.log(text);


console.log('Leyendo el segundo archivo...');
const secondText = await readFile('./archivo2.txt', 'utf-8')
console.log(secondText);
