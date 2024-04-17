//17/04 criar dois novos endpoints


//requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

//imports
const mysql_config = require('./imp/mysql_config');
const functions = require('./imp/functions');
const { truncateSync } = require('fs');

//variáveis para disponibilidade e para versionamento
const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';

//iniciar servidor
const app = express();
app.listen(3000,()=>{
    console.log("API está executando");
})

//verificar a disponbibilidade da API
app.use((req,res,next)=>{
    if(API_AVAILABILITY){
        next()
    }else{
        res.json(functions.response('atenção','API está em manutenção. Sorry!',0,null));

    }
})

//conexão com mysql
const connection = mysql.createConnection(mysql_config);

//cors
app.use(cors());

//rotas 
//rota inicial (entrada)
app.get('/',(req,res)=>{
    res.json(functions.response("sucesso","API está rodando",0,null))
})

//endpoint
//rota para a consulta completa
app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err,rows)=>{
        if(!err){
            res.json(functions.response('Sucesso',
                 'Sucesso na consulta',rows.length,rows))
        }else{
            res.json(functions.response('erro',err.message,0,null))
        }
    })
})

//rota para fazer uma consulta de task por id
app.get('/tasks/:id',(req,res)=>{
    const id=req.params.id;
    connection.query('SELECT * FROM tasks WHERE id =?',[id],(err,rows)=>{
        if(!err){
            if(rows.length){
            res.json(functions.response('Sucesso','Sucesso na pesquisa',rows.length,rows))
        }else{
            res.json(functions,response('Atenção','Não foi encontrada a task selecionada',0,null))

        }
    }else{
        res.json(functions.response('erro',err.message,0,null))
    }
    
    })
 })

 //rota para atualizar o status da task pelo id selecionado
 app.put('/tasks/:id/status/:status',(req,res)=>{
    const id=req.params.id;
    const status=req.params.status;
    connection.query('UPDATED tasks SET status =? WHERE id=?',[status,id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Sucesso na alteração do status',rows.affectedRows,null));
            }else{
                res.json(functions.response('Alerta vermelho','Task não encontrada',0,null));
            }
        }else{
            res.json(functions.response('Erro',err.message,0,null));

        }
        
    })
})

app.use((req,res)=>{
    res.json(functions.response('atenção',
                'Rota não encontrada',0,null))
})