// importação de modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// importação do modulo interno
const fs = require('fs')

operation() //chamando a operação para quando o programa seja iniciado ela vir junto

// criando as operações que o sistema pode fazer 
function operation(){

  inquirer.prompt([
    {
    type: 'list', // configurando a forma que as perguntas irão aparecer
    name:'action', // o nome da variavel onde a resposta vai ficar salva
    message: 'O que você deseja fazer?', 
    // escolhas que vão aparecer na lista
    choices: [
      'Criar conta',
      'Consultar saldo',
      'Depositar',
      'Sacar',
      'Sair'
    ]
  },
]).then((answers)=>{
    const action = answers['action']

    console.log(action)

}).catch((err)=> console.log(err))
}

