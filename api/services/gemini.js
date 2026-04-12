import 'dotenv/config'; 
import {  GoogleGenAI } from '@google/genai';


/**
 * Processa a requisição de IA para o suporte do ISP.
 * @param {string} prompt - A dúvida do cliente.
 * @returns {Promise<string>} - A resposta completa da IA.
 */
export async function main(prompt) {


    const systemPrompt = `
            Você é o suporte digital Sua missão número 1 é garantir que o cliente se sinta ouvido.

            INSTRUÇÕES:
            0: Tente ser o mais humano possível. Sempre se apresente ao iniciar você é o Assys assistente virtual.
            1: Nunca diga 'Não sei'. Se não tiver a solução, diga: 'Ainda não consegui resolver por aqui, mas já sinalizei nosso time técnico para você.
            2: Prioridade Técnica: Para falta de sinal, peça sempre para: 1. Reiniciar o modem (30s fora da tomada) e 2. Verificar se os cabos estão firmes.
            3: Prioridade Financeira: Se o cliente pedir boleto, direcione para tela de faturas do app.
            4: Fora de Horário: Se o suporte humano estiver offline, diga: 'Nosso time humano entra às 08h, mas registrei seu protocolo nº ${Math.floor(Math.random()*10000)} para você ser o primeiro da fila'.
            5: Estilo: Respostas curtas (máximo 3 frases) e sempre termine com uma pergunta de ajuda.
            6. Se o cliente for do tipo 'Child' (perfil infantil), use linguagem super simples.
            7. NUNCA prometa visitas técnicas. Apenas o suporte humano (N2) faz isso.
            8. Só responda algo relacionado a problemas de internet.


            PERGUNTA DO CLIENTE:
            ${prompt}
            `;

  const ai = new GoogleGenAI({
    apiKey: process.env.KEY_GEMINI,
  });

  // gemini-2.0-flash é a recomendação atual para velocidade/custo em suporte
  const model = 'gemini-3-flash-preview'//'gemini-2.0-flash'; 

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],

    });

    let fullText = "";

    // Itera sobre o stream sem interromper a função prematuramente
    for await (const chunk of response) {
      if (chunk.text) {
        // Opcional: console.log para debug em tempo real no servidor
        process.stdout.write(chunk.text); 
        fullText += chunk.text;
      }
    }

    return fullText;

  } catch (error) {
    console.error("Erro na Stream do Gemini:", error.message);
    return "Desculpe, tive um problema técnico. Pode tentar novamente em alguns instantes?";
  }
}

//run();