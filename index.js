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
      viewBalance()
    } else if (action === "Depositar"){ // caso tenha escolhido a opção de depositar dinheiro na conta
      deposit()
    } else if (action === "Sacar"){ // caso tenha escolhido a opção de sacar dinheiro da conta
      withdraw()
    } else if (action === "Sair"){ // caso usuário tenha escolhido sair da operação
      console.log(chalk.bgBlue("Obrigado por usar nosso banco!")) //mensagem que irá aparecer para o usuário ao sair do programa
      process.exit() //comando para finalizar o programa
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

// add an amount to user account (depositando dinheiro na conta do usuário)
function deposit(){

  inquirer.prompt([{
    name: 'accountName', //salvando a resposta do usuário em accountName para que possa ser usado depois
    message: 'Qual o nome da sua conta?'
  }])
  .then((answers)=> {
    const accountName = answers['accountName'] //salvando a resposta em uma variavel

    // verificando se a conta existe
    if (!checkAccount(accountName)){ 
      return deposit() // retornando para o começo da função para que o usuário tente novamente
    }

    inquirer.prompt([{ //salvando a resposta do usuário em ammount
      name: 'amount',
      message: 'Quanto você gostaria de depositar?' 
    }])
    .then((answers)=>{
      const amount = answers['amount'] //salvando a quantidade de dinheiro que o usuário deseja depositar

      //adicionando o valor
      addAmount(accountName, amount )
      operation()
    })
    .catch(err=>console.log(err))//pegando o erro e imprindo ele caso exista 

  })
  .catch(err => console.log(err)) //capiturando erro e imprimindo caso ocorra algum erro
}

// função que verifica se a conta existe
function checkAccount(accountName){
   if(!fs.existsSync(`accounts/${accountName}.json`)){ // usando fs fazemos uma verificação se dentro do diretório accounts existe uma conta com o nome da accountName
    console.log(chalk.bgRed("Essa conta não existe, escolha outro nome!")) //imprimindo mensagem de erro, falando que essa conta nao existe
    return false //retorna falaso para dizer que a conta não existe
   }

   return true //caso tenha passado pela verificação quer dizer que a conta existe por isso retorna true
}

//adicionando o valor dentro da conta do usuário
function addAmount(accountName, amount){
  const accountData = getAccount(accountName)

  if(!amount){ // verificando se o usuário enviou algum valor
    console.log(chalk.bgRed.black("Ocorreu um erro tente novamente mais tarde")) //mensagem de erro
    return deposit() // voltando para a ação de depositar
  }

  //nesse ponto aqui ja foi verificado se o valor existe 
  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) //estou pegando o valor que tem na conta e somando com o valor que o usuário escolheu depositar isso acontece por accountData ser um json
  
  fs.writeFileSync( //usando fs para escrever num arquivo 
   `accounts/${accountName}.json`, //pegando o arquivo que deve ser alterado
    JSON.stringify(accountData), //convertendo o accountData em texto para o fs escrever no arquivo
    function(err){ //chamando um callback para evidenciar um erro que pode ocorrer
      console.log(err) 
    }
  )

  console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`)) //mensagem de operação bem sucedida
}

// função para pegar uma conta
function getAccount(accountName){
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{ // criando uma variavel que utiliza o modulo fs que vai ler um arquivo dentro da pasta accounts com o nome da conta
    encoding: 'utf8', // colocando o padrão brasileiro para aceitar acentos e ç
    flag: 'r' //essa flag fala que eu só quero ler o arquivo
  })

  return JSON.parse(accountJSON) //o accountJSON estava lendo um arquivo entao estava vindo como texto mas com o JSON.parse ele esta convertendo o accountJSON para um JSON
}

function viewBalance(){

  inquirer.prompt([{ //usando o inquirer para saber qual conta o usuário deseja saber o saldo
    name: 'accountName', //nome da pergunta
    message: 'Qual é o nome da conta que deseja ver o saldo?' //a pergunta em si
  }])
  .then((answers)=> { //quando o inquirer terminar é para fazer a seguinte execução
    const accountName = answers['accountName'] //armazenando a resposta do inquirer em uma váriavel

    //verificando se o usário enviou algum valor para o account name
    if(!accountName){ 
      console.log(chalk.bgRed.black("Por favor digite uma conta válida!"))
      return viewBalance() //caso tenha voltado vazio volta para o viewBalance para iniciar de novo
    }

    //verificando se a conta existe
    if(!checkAccount(accountName)){
      return viewBalance() //caso nao exista volta para o viewbalance para tentar outra conta
    }

    const accountData = getAccount(accountName) //pegando os dados da conta com o getAccount passando como parametro o nome da conta que o usuário inseriu

    const accountBalance = accountData.balance //pegando o saldo da conta que esta em accountData 

    console.log(chalk.bgGreen(`Você tem um saldo de: R$${accountBalance}`)) //colocando em tela o saldo da conta

    operation() //retornando para as operações
  })
  .catch(err => console.log(err)) //callback para possiveis erros
}

function withdraw(){
  inquirer.prompt([{
    name: 'accountName',
    message: 'Qual o nome da conta que deseja sacar?'
  }])
  .then((answers)=>{
    const acconutName = answers['accountName'] //salvando em uma variavel o nome da conta
    if(!acconutName){ //verificação para saber se foi enviado algum nome 
      console.log(chalk.bgRed.black("Insira o nome de uma conta válida!")) //mensagem de erro caso nao tenha sido enviado algum valor
      return withdraw()
    }
    if(!checkAccount(acconutName)){ //verificando se a conta existe
      return withdraw() //caso ela nao exista irá retornar para o withdraw
    }

    const accountData = getAccount(acconutName)
    inquirer.prompt([{ // iniciando a pergunta para sacar o dinheiro
      name: 'amount', 
      message: 'Qual o valor deseja sacar?'
    }])
    .then((answers)=>{ 
      const amount = answers['amount'] //salvando a resposta em uma váriavel
      if(!amount){ //verificando se foi passado algum valor para dentro da resposta
        console.log(chalk.bgRed.black('Insira um valor válido!!'))
        return withdraw()
      }

      //verificação para saber se tem saldo disponivel
      if(accountData.balance < amount){ 
        console.log(chalk.bgRed.black("Saldo indisponível para resgate"))
        return withdraw()
      }
      accountData.balance = parseFloat(accountData.balance) - parseFloat(amount) //fazendo a subtração do valor do usuário

      fs.writeFileSync( //escrevendo no arquivo json
        `accounts/${acconutName}.json`, // pasta onde eu quero sacar
        JSON.stringify(accountData), //atualizando os dados da conta
        function(err){ // callback caso exista um erro
          console.log(err) //imprimindo esse erro
        }
      )
      console.log(chalk.bgBlue(`Saque realizado com sucesso! Saldo atual: R$${accountData.balance}`))
      operation() //voltando para as operações após finalizar o saque
    })
    .catch(err=>console.log(err)) 

  })
  .catch(err=>console.log(err))
}