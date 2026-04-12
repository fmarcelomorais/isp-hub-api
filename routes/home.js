import { Router } from 'express';
import { getISP, getServer, getTheme} from '../repositories/reposotory.js';

const routerHome = Router();

routerHome.get('/', (req, res) => {
  res.send('Rota Home');
});

routerHome.get('/servidor', async (req, res) => {   

    const servidor = await getServer();
    res.json(servidor);
})

routerHome.get('/home/:codigo_isp', async (req, res) => {

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

export default routerHome;