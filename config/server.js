// Importa a biblioteca WebSocket para criar um servidor WebSocket.
const WebSocket = require("ws");
// Importa a biblioteca axios para fazer requisições HTTP.
const axios = require('axios');

// Cria um servidor WebSocket na porta 3000.
const wss = new WebSocket.Server({
    port: 3000, // Porta em que o servidor WebSocket vai rodar.
    clientTracking: true, // Habilita o rastreamento de clientes conectados.
    connectTimeout: 10000, // Tempo máximo de espera para conexão (10 segundos).
    perMessageDeflate: { // Configuração para compressão de mensagens.
        zlibDeflateOptions: {
            chunkSize: 1024, // Tamanho do chunk para compressão.
            memLevel: 7, // Nível de memória usado para compressão.
            level: 3 // Nível de compressão (1-9, onde 9 é o máximo).
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024 // Tamanho do chunk para descompressão.
        }
    }
});

// Evento disparado quando um cliente se conecta ao servidor WebSocket.
wss.on('connection', async (ws) => {
    console.log('Cliente conectado'); // Loga a conexão de um novo cliente.

    // Configura um mecanismo de "ping" para manter a conexão ativa.
    ws.isAlive = true; // Define que a conexão está ativa.
    ws.on('pong', () => {
        ws.isAlive = true; // Atualiza o status da conexão quando recebe um "pong".
    });

    // Evento disparado quando o servidor recebe uma mensagem do cliente.
    ws.on('message', async (message) => {
        try {
            console.log('Mensagem recebida:', message); // Log da mensagem recebida
    
            // Tenta fazer o parsing da mensagem
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch (parseError) {
                console.error('Erro ao fazer parsing da mensagem:', parseError);
                // ws.send('Erro: Mensagem inválida. Envie um JSON válido.');
                return;
            }
    
            // Verifica se a propriedade "messages" existe e é um array
            if (!parsedMessage.messages || !Array.isArray(parsedMessage.messages)) {
                console.error('Propriedade "messages" ausente ou inválida:', parsedMessage);
                // ws.send('Erro: A propriedade "messages" é obrigatória e deve ser um array.');
                return;
            }
    
            console.log('Histórico de mensagens enviado:', parsedMessage.messages); // Log do histórico
    
            // Faz uma requisição POST para a API do OpenRouter AI
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'deepseek/deepseek-r1-distill-llama-70b:free',
                    messages: parsedMessage.messages // Envia o histórico de mensagens
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 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'
                    }
                }
            );
    
            console.log('Resposta da API:', response.data); // Log da resposta da API
    
            // Verifica se a resposta da API não contém erros
            if (!response.data.error) {
                // Extrai a resposta da IA
                const aiResponse = response.data.choices[0].message.content;
                // Envia a resposta da IA de volta para o cliente
                ws.send(aiResponse);
            }
    
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            // ws.send('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.');
        }
    });

    // Evento disparado quando o cliente fecha a conexão.
    ws.on('close', () => {
        console.log('Cliente desconectado'); // Loga a desconexão do cliente.
    });
});

// Loga que o servidor está rodando.
console.log('Servidor rodando na porta 3000'); // Observação: O código diz "porta 8080", mas o servidor está configurado para a porta 3000.