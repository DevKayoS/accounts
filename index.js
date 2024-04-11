// importação de modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// importação do modulo interno
const fs = require('fs')

inquirer.prompt([{
  name: 'name',
  message: 'Qual é o seu nome?'
}]).then((answers)=> {
  console.log(chalk.green(`Seja muito bem vindo ${answers.name}`))
})

