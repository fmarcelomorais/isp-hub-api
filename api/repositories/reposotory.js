import { pool } from '../index.js';

export async function getServer() {
    const sql = 'SELECT nome, servidor, ativo FROM servidores WHERE ativo = true';
    const result = await pool.query(sql);
    console.log(result.rows[0])
    return result.rows[0];
}

export async function getTheme(codigo_isp) {

    const sql = `SELECT DISTINCT
                 t.logo_url as logo, t.background_color as backgroundColor, t.text_color as textColor, t.button_color as buttonColor, t.menu_bar as menuBar, t.icon_bar as iconBar, t.general_color as generalColor, t.icon_active as iconActive, t.text_button_color as textButtonColor, t.text_color_title as textColorTitle, t.text_color_subtitle as textColorSubtitle 
                 FROM tema t
                 WHERE codigo_isp = $1`;
    
    const result = await pool.query(sql, [codigo_isp]);
    const dados = result.rows;
    console.log(dados)
    return dados[0];
}

export async function getISP(codigo_isp) {

    const sql = `SELECT DISTINCT i.nome, t.logo_url as logo, i.slug, i.receitanet_id as codigo_isp, i.ativo, i.manutencao_sistema as manutencao, i.aviso_global as avisoGlobal, i.aviso_ativo as avisoAtivo, i.nome_suporte_automatico as suporteautomatico
                 FROM isps i
                 JOIN tema t ON t.codigo_isp = i.receitanet_id  
                 WHERE receitanet_id = $1`;
    
    const result = await pool.query(sql, [codigo_isp]);
    const dados = result.rows;

    return dados[0];
}

export async function getBanner(codigo_isp) {
    
    const sql = `SELECT DISTINCT
                 b.id as banner_id, b.imagem_url as banner_image, b.link_acao as banner_action, b.ordem as banner_order, b.title as banner_title, b.subtitle as banner_subtitle, b.cta as banner_cta, b.type as banner_type, b.background_color as banner_background, b.text_color as banner_text_color, b.action as banner_action
                 FROM banners b
                 WHERE codigo_isp = $1`;
    
    const result = await pool.query(sql, [codigo_isp]);
    const dados = result.rows;

    return dados;
}

export async function getPartner(codigo_isp) {
    
    const sql = `SELECT DISTINCT 
                 p.id as parceiro_id, p.nome_parceiro, p.cep, p.segmento, p.titulo as parceiro_title, p.subtitulo as parceiro_subtitle, p.texto as parceiro_texto, p.cor_primaria as parceiro_background_color, p.cor_secundaria as parceiro_text_color, p.imagem_url as parceiro_image, p.type as parceiro_type
                 FROM parceiros p
                 WHERE codigo_isp = $1`;
    
    const result = await pool.query(sql, [codigo_isp]);
    const dados = result.rows;

    return dados;
}

export async function getBenefit(codigo_isp, plano) {

    const sql = 'SELECT * FROM planos WHERE codigo_isp = $1 AND plano LIKE $2;'
    const buscaPlano = `%${plano}%`;
    const result = await pool.query(sql, [codigo_isp, buscaPlano])

    const dados = result.rows;

    return dados[0]
}

export async function getUpgrade(codigo_isp) {
    const sql = 'SELECT * FROM upgrade WHERE codigo_isp = $1;'
    const result = await pool.query(sql, [codigo_isp]);

    return result.rows[0]
}