// argumentos de entrada
console.log(process.argv)

// controlar el proceso y su salida
//process.exit(1)

// podemos controlar eventos del proceso
process.on('exit', ()=>{
    //limpiar los recurso
})

//current warking directory
console.log(process.cwd());

//plataform
console.log(process.env.PEPITO)