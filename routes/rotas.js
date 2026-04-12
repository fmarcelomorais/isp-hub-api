import { Router } from 'express';
import { pool } from '../server.js';
import axios from 'axios';
import { getBanner, getBenefit, getISP, getPartner, getServer, getTheme, getUpgrade } from '../repositories/reposotory.js';
import { main } from '../services/gemini.js';

const router = Router();

const getIspConfig = async (receitanet_id) => {
    const result = await pool.query(
        'SELECT secret_key, ativo FROM isps WHERE receitanet_id = $1',
        [receitanet_id]
    );

    return result.rows[0];
};

const BASE_URL = "https://api.receitanet.net/centralassinante/v1"

router.get('/', (req, res) => {
  res.send('API rodando e conectada ao Postgres! 🚀');
});

router.get('/servidor', async (req, res) => {
    
    const servidor = await getServer();
    res.json(servidor);
})

router.get('/home/:codigo_isp', async (req, res) => {

    const { codigo_isp } = req.params;

    const ispResult = await getISP(codigo_isp); 
    const themeResult = await getTheme(codigo_isp);
   
    const isp = {
        codigoISP: ispResult.codigo_isp,
        logo: ispResult.logo,
        nome: ispResult.nome,
        slug: ispResult.slug,
        status: ispResult.ativo,
        avisGlobal: ispResult.avisoGlobal,
        avisoAtivo: ispResult.avisoAtivo,
        manutencao: ispResult.manutencao
    }

    const theme = {
        logo: themeResult.logo,
        backgroundColor: themeResult.backgroundcolor,
        textColor: themeResult.textcolor,
        buttonColor: themeResult.buttoncolor,
        menuBar: themeResult.menubar,
        iconBar: themeResult.iconbar,
        iconActive: themeResult.iconactive,
        buttonTextColor: themeResult.textbuttoncolor,
        generalColor: themeResult.generalcolor,
        textColorTitle: themeResult.textcolortitle,
        textColorSubtitle: themeResult.textcolorsubtitle
    }
    
    const init = {
        isp: isp,
        theme: theme,
    }

    res.json(init)
})

router.get('/isp/:codigo_isp', async (req, res) => {
    const {codigo_isp} = req.params;

    const response = await getISP(codigo_isp);
    const isp = {
        codigoISP: response.codigo_isp,
        logo: response.logo,
        nome: response.nome,
        slug: response.slug,
        status: response.ativo,
        avisGlobal: response.avisoGlobal,
        avisoAtivo: response.avisoAtivo,
        manutencao: response.manutencao,
        atendenteVirtual: response.suporteautomatico
    }
    console.log(response)
    res.status(200).json(isp);
})

router.get('/theme/:codigo_isp', async (req, res) => {
    const {codigo_isp} = req.params;

    const response = await getTheme(codigo_isp);

    const theme = {
        logo: response.logo,
        backgroundColor: response.backgroundcolor,
        textColor: response.textcolor,
        buttonColor: response.buttoncolor,
        menuBar: response.menubar,
        iconBar: response.iconbar,
        iconActive: response.iconactive,
        buttonTextColor: response.textbuttoncolor,
        generalColor: response.generalcolor,
        textColorTitle: response.textcolortitle,
        textColorSubtitle: response.textcolorsubtitle
    }

    res.status(200).json(theme);
})

router.get('/banners/:codigo_isp', async (req, res) => {
    const {codigo_isp} = req.params;
    const result = await getBanner(codigo_isp)
    const banners = []

    result.forEach(b => {
        banners.push({
            id: b.banner_id,
            image: b.banner_image,
            bannerAction: b.banner_action,
            bannerOrder: b.banner_order,
            bannerTitle: b.banner_title,
            bannerSubtitle: b.banner_subtitle,
            bannerCta: b.banner_cta,
            bannerType: b.banner_type,
            bannerBackground: b.banner_background,
            bannerColor: b.banner_text_color
        })
    })


    res.json(banners);
})

router.get('/partner/:codigo_isp', async (req, res) => {
    const {codigo_isp} = req.params;
    const result = await getPartner(codigo_isp)
    const partners = []
    result.forEach( p => {
        partners.push({
            id: p.parceiro_id,
            partnerName: p.nome_parceiro,
            partnerCodePostal: p.cep,
            partnerSegment: p.segmento,
            partnerTitle: p.parceiro_title,
            partnerSubtitle: p.parceiro_subtitle,
            partnerText: p.parceiro_texto,
            partnerBackgroundColor: p.parceiro_background_color,
            partnerColorText: p.parceiro_text_color,
            image: p.parceiro_image,
            partnerType: p.parceiro_type
        })
    })
    res.json(partners);
})

router.get('/planos/:codigo_isp/:plano', async (req, res) => {     
    const {codigo_isp, plano} = req.params;
    const result = await getBenefit(codigo_isp, plano)

    const benefits = {
        vantagem1: result.vantagem_1,
        vantagem2: result.vantagem_2,
        vantagem3: result.vantagem_3,
        vantagem4: result.vantagem_4,
        vantagem5: result.vantagem_5,
        vantagem6: result.vantagem_6,
        download: result.download,
        upload: result.upload,
        plano: result.plano
    }

    res.json(benefits);
})

router.get('/upgrade/:codigo_isp', async ( req, res) => {
    const { codigo_isp } = req.params;
    const result = await getUpgrade(codigo_isp);

    const upgrade = {
        plano: result.plano,
        valor: result.valor,
        acao: result.action
    }

    res.json(upgrade)
})

// TOKEN
router.get('/token/:codigo_isp/:cpf', async (req, res) => {

    const { codigo_isp, cpf,  } = req.params;    
  
    const config = await getIspConfig(codigo_isp);

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

router.post('/multiplos/token/:receitanet_id/:cpf/:id_cliente', async (req, res) => {

    const { receitanet_id, cpf, id_cliente } = req.params;
    
    try{
        const config = await getIspConfig(receitanet_id);

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

// ROTA DE CLIENTE 
router.get('/cliente/resumo/:token', async (req, res) => {
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

// --- ROTA 1: BUSCAR FATURAS (Básico) ---
router.get('/faturas/:token', async (req, res) => {
    const {token} = req.params;

    try{

        const response = await axios.get(`${BASE_URL}/financeiros/faturas`,
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


//CHAMADOS
router.get('/chamados/:token', async (req, res) => {
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

router.post('/chamados/abrir/:token', async (req, res) => {

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

router.post('/suporte/chat/:mensagem', async (req, res) => {
    const { mensagem } = req.params;

    //const mensagem = "Olá, como posso ajudar no suporte técnico hoje?";
    const gemini = await main(mensagem)
    res.json(gemini)
})

export default router;