import { Router } from 'express';
import { getBenefit, getISP, getServer, getTheme, getUpgrade} from '../repositories/reposotory.js';

const routerHome = Router();

routerHome.get('/', (req, res) => {
  res.send('Rota Home');
});

routerHome.get('/servidor', async (req, res) => {   

    const servidor = await getServer();
    res.json(servidor);
})

routerHome.get('/init/:codigo_isp', async (req, res) => {

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

routerHome.get('/isp/:codigo_isp', async (req, res) => {
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

routerHome.get('/theme/:codigo_isp', async (req, res) => {
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

routerHome.get('/banners/:codigo_isp', async (req, res) => {
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

routerHome.get('/partner/:codigo_isp', async (req, res) => {

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

routerHome.get('/planos/:codigo_isp/:plano', async (req, res) => {     
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

routerHome.get('/upgrade/:codigo_isp', async ( req, res) => {

    const { codigo_isp } = req.params;
    const result = await getUpgrade(codigo_isp);

    const upgrade = {
        plano: result.plano,
        valor: result.valor,
        acao: result.action
    }

    res.json(upgrade)
})


export default routerHome;