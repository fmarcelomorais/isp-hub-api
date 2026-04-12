import { Router } from 'express';
import axios from 'axios';

const suporte = Router()

const BASE_URL = "https://api.receitanet.net/centralassinante/v1";

//CHAMADOS
suporte.get('/chamados/:token', async (req, res) => {
    const {token} = req.params;

    try{

        const response = await axios.get(`${BASE_URL}/chamados/`,
            { headers: { 
                'accept': 'application/json', 
                'Authorization': `Bearer ${token}` } 
            });

        res.json(response.data)
    }
    catch(error){
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
})

suporte.post('/chamados/abrir/:token', async (req, res) => {

    const {token} = req.params;
    const body = req.body;

    const dadosChamado = `Cliente: ${body?.nome || ""}\nCpf do clente: ${body?.cpf || ""}\nDescrição do problema: ${body.descricao}\nData e Hora do Chamado: ${new Date().toLocaleString("pt-BR")}
    `
    console.log(token, dadosChamado)
    try{

        //res.json(dadosChamado)
         const response = await axios.post(`${BASE_URL}/chamados/`, { descricao: dadosChamado },
            { 
                headers: { 
                'accept': 'application/json', 
                'Authorization': `Bearer ${token}` } 
            },
            
        
        );

        res.json(response.data)  
    }
    catch(error){
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
})

/* suporte.post('/suporte/chat/:mensagem', async (req, res) => {
    const { mensagem } = req.params;

    //const mensagem = "Olá, como posso ajudar no suporte técnico hoje?";
    const gemini = await main(mensagem)
    res.json(gemini)
})
 */

export default suporte;