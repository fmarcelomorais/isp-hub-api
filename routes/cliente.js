import { Router } from 'express';
import axios from 'axios';

const cliente = Router();

const BASE_URL = "https://api.receitanet.net/centralassinante/v1";

cliente.get('/cliente/resumo/:token', async (req, res) => {
    const { token } = req.params;
    
    try{

        const response = await axios.get(`${BASE_URL}/cliente/resumo`,
            { headers: { 
                'accept': 'application/json', 
                'Authorization': `Bearer ${token}` } 
            }
        );

        res.json(response.data)
    }
    catch(error)
    {
         res.status(500).json({ error: 'Erro ao conectar com ReceitaNet' });
    }
})

export default cliente;