// importação de modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// importação do modulo interno
const fs = require('fs')
const { create } = require('domain')

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
    const action = answers['action'] //armazenando a resposta numa variavel 
    if(action === "Criar conta"){ //caso tenha escolhido criar uma conta irá chamar a função createAccount
      createAccount() //função sendo chamada para cirar conta
    } else if(action === "Consultar saldo"){ //caso tenha escolhido a opção de consulta de saldo

    } else if (action === "Depositar"){ // caso tenha escolhido a opção de depositar dinheiro na conta

    } else if (action === "Sacar"){ // caso tenha escolhido a opção de sacar dinheiro da conta

    } else if (action === "Sair"){ // caso usuário tenha escolhido sair da operação
      console.log(chalk.bgBlue("Obrigado por usar nosso banco!")) //mensagem que irá aparecer para o usuário ao sair do programa
      process.exit()
    }
}).catch((err)=> console.log(err)) //catch para caso alguma coisa dê errado seja imprimido a mensagem de erro
}

//criando uma conta
function createAccount(){
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!!')) //mensagem de parabenização
  console.log(chalk.green('Defina as opções da sua conta a seguir!!')) 

  buildAccount() //chamando a função de construção de conta, para de fato ela ser criada
}

// criando a conta de fato e armazenando ela 
function buildAccount(){
  inquirer.prompt([{ //usando o inquirer para armazenar o nome da conta
    name: 'accountName', //nome da pergunta
    message: 'Digite um nome para a sua conta: ' //pergunta exibida no terminal 
  }]).then((answers)=> { //promise que vai ser usada após a execução da pergunta
    const acconutName = answers['accountName'] //variavel onde ficou armazenada o nome da conta
    

    console.info(acconutName) //imprimindo o nome da conta

    if(!fs.existsSync('accounts')){ //fazendo uma verificação se existe uma pasta criada com esse nome
      fs.mkdirSync('accounts') // caso não exista ela está sendo criada nessa linha
    } 

    if(fs.existsSync(`accounts/${acconutName}.json`)){ // verificando se dentro da pasta accounts existe um arquivo com o nome da conta
      console.log(chalk.bgRed.black('O nome da conta já existe!')) // imprimindo mensagem de erro caso exista essa conta
      buildAccount() //retornando para a função de builAccount para executar novamente o programa e escolher outro nome
      //para nao gerar um bug e ficar rodando infinito para encerrar o programa
    }

    fs.writeFileSync(`accounts/${acconutName}.json`, `{"balance": 0}`, function(err){ //criando o arquivo json com o nome da conta, e inserindo o saldo da conta e uma função de erro
      console.log(err) //imprindo um erro caso ocorra
    })

    console.log(chalk.green('Parabéns sua conta foi criada com sucessso!')) // mensagem de sucesso de criação de conta
    operation() //apos criar a conta volta para execução para o usuário não sair do programa
  }).catch((err)=> console.log(err)) //verificando se a função teve erro

}
