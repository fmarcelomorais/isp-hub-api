import { Router } from 'express';
import axios from 'axios';
import { getISP } from '../repositories/reposotory.js';

const auth = Router();

const BASE_URL = "https://api.receitanet.net/centralassinante/v1"

auth.get('/token/:codigo_isp/:cpf', async (req, res) => {

    const { codigo_isp, cpf  } = req.params;    
  
    const config = await getISP(codigo_isp);

    if (!config || !config.ativo) {
        return res.status(404).json({ error: 'Provedor inativo ou não encontrado' });
    }
    
    const response = await axios.post(`${BASE_URL}/token`, 
        {
            grant_type: 'password',
            client_id: codigo_isp,
            client_secret: config.secret_key,
            cpfcnpj: cpf,
        });
    if(response.status === 200)
        return res.json(response.data)
    else
       return res.status(401).json({erro: null})

    
})

auth.post('/multiplos/token/:receitanet_id/:cpf/:id_cliente', async (req, res) => {

    const { receitanet_id, cpf, id_cliente } = req.params;
    
    try{
        const config = await getISP(receitanet_id);

        if (!config || !config.ativo) {
            return res.status(404).json({ error: 'Provedor inativo ou não encontrado' });
        }
        
        const response = await axios.post(`${BASE_URL}/token`, 
            {
                grant_type: 'password',
                client_id: receitanet_id,
                client_secret: config.client_secret,
                cpfcnpj: cpf,
                idCliente: id_cliente
            });

            res.json(response.data)

    }
    catch(error) {
        res.status(500).json({ error: error.message});
    }
})

export default auth;