import 'dotenv/config'; 
import { Router } from 'express';
import axios from 'axios';

const ixc = Router();

const BASE_URL = "https://comnecttelecom.com.br/webservice/v1";

const token = Buffer.from(`${process.env.IXC_USER}:${process.env.IXC_TOKEN}`).toString("base64");
const headers = {
  accept: 'application/json',
  Authorization: `Basic ${token}`,
  ixcsoft: 'listar'
};

async function buscarIdCliente(cpf) {
    
    try{

        const response = await axios.get(`${BASE_URL}/cliente`,
            { 
                 data: {
                    qtype: "cliente.cnpj_cpf",
                    query: cpf,
                    oper: "=",
                    page: 1,
                    rp: 10,
                 },
                 headers
            }
        );
        console.log(response.data.registros[0].id)
        return response.data.registros[0].id
    }
    catch(error)
    {
        return { error: 'Erro ao conectar com ReceitaNet' };
    }
}

async function buscarIdContrato(id) {
    
    try{

        const response = await axios.get(`${BASE_URL}/cliente_contrato`,
            { 
                data: {
                    qtype: "cliente_contrato.id_cliente",
                    query: id,
                    oper: "=",
                    page: 1,
                    rp: 10,
                    sortname: "cliente_contrato.id_cliente",
                    sortorder: "desc"
                },
                headers
            }
        );
        console.log(response.data.registros[0].id)
        return response.data.registros[0].id
    }
    catch(error)
    {
        return { error: 'Erro ao conectar com ReceitaNet' };
    }
}

async function buscarFaturas(id) {
    
    try{

       const response = await axios.get(`${BASE_URL}/fn_areceber`,
            { 
                 data: {
                    qtype: "fn_areceber.id_contrato",
                    query: id,
                    oper: "=",
                    rp: 20000,
                    sortname: "fn_areceber.data_vencimento",
                    sortorder: "asc",
                    grid_param: "[{\"TB\":\"fn_areceber.liberado\", \"OP\" : \"=\", \"P\" : \"S\"}, {\"TB\":\"fn_areceber.status\", \"OP\" : \"!=\", \"P\" : \"C\"},{\"TB\":\"fn_areceber.status\", \"OP\" : \"!=\", \"P\" : \"R\"}]"
                 },
                 headers
            }
        );
        
        return response.data
    }
    catch(error)
    {
        return { error: 'Erro ao conectar com ReceitaNet' };
    }
}
function ajustaCpf(cpf){
     
  cpf = cpf.replace(/\D/g, '');

  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return cpf;
}
ixc.get('/cliente/:cpf', async (req, res ) => {
     const { cpf } = req.params;
     const token = Buffer.from(`${process.env.IXC_USER}:${process.env.IXC_TOKEN}`).toString("base64");
    try{

        const response = await axios.get(`${BASE_URL}/cliente`,
            { 
                 data: {
                    qtype: "cliente.cnpj_cpf",
                    query: cpf,
                    oper: "=",
                    page: 1,
                    rp: 10,
                 },
                headers: { 
                    'accept': 'application/json', 
                    'Authorization': `Basic ${token}`,
                    'ixcsoft': 'listar'
                } 
            }
        );
        console.warn(cpf)
        res.json(response.data)
    }
    catch(error)
    {
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
} )

ixc.get('/contratos/:id', async (req, res ) => {
     const { id } = req.params;
     const token = Buffer.from(`${process.env.IXC_USER}:${process.env.IXC_TOKEN}`).toString("base64");
    try{

        const response = await axios.get(`${BASE_URL}/cliente_contrato`,
            { 
                 data: {
                    qtype: "cliente_contrato.id_cliente",
                    query: id,
                    oper: "=",
                    page: 1,
                    rp: 10,
                    sortname: "cliente_contrato.id_cliente",
                    sortorder: "desc"
                 },
                headers: { 
                    'accept': 'application/json', 
                    'Authorization': `Basic ${token}`,
                    'ixcsoft': 'listar'
                } 
            }
        );
        console.warn(id)
        res.json(response.data)
    }
    catch(error)
    {
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
} )

ixc.get('/financeiro/:id', async (req, res ) => {
     const { id } = req.params;
     const token = Buffer.from(`${process.env.IXC_USER}:${process.env.IXC_TOKEN}`).toString("base64");
    try{

        const response = await axios.get(`${BASE_URL}/fn_areceber`,
            { 
                 data: {
                    qtype: "fn_areceber.id_contrato",
                    query: id,
                    oper: "=",
                    rp: 20000,
                    sortname: "fn_areceber.data_vencimento",
                    sortorder: "asc",
                    grid_param: "[{\"TB\":\"fn_areceber.liberado\", \"OP\" : \"=\", \"P\" : \"S\"}, {\"TB\":\"fn_areceber.status\", \"OP\" : \"!=\", \"P\" : \"C\"},{\"TB\":\"fn_areceber.status\", \"OP\" : \"!=\", \"P\" : \"R\"}]"
                 },
                headers: { 
                    'accept': 'application/json', 
                    'Authorization': `Basic ${token}`,
                    'ixcsoft': 'listar'
                } 
            }
        );
        console.warn(id)
        res.json(response.data)
    }
    catch(error)
    {
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
} )

ixc.get('/faturas/:cpf', async (req, res) => {
    const { cpf } = req.params;
    const cpfAjustao = ajustaCpf(cpf)
    const idCliente = await buscarIdCliente(cpfAjustao)
    console.log(idCliente)
    const idContrato = await buscarIdContrato(idCliente)
    console.log(idContrato)
    const faturas = await buscarFaturas(idContrato)
    res.json(faturas)
})

export default ixc;