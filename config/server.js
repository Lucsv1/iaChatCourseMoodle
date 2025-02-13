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
            // Converte a mensagem recebida (em formato JSON) para um objeto JavaScript.
            const { message: userMessage } = JSON.parse(message);

            // Faz uma requisição POST para a API do OpenRouter AI.
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions', // Endpoint da API.
                {
                    model: 'deepseek/deepseek-r1:free', // Modelo de IA a ser usado.
                    messages: [{ role: 'user', content: userMessage }] // Mensagem do usuário.
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON.
                        'Authorization': 'Bearer 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' // Token de autenticação.
                    }
                }
            );

            // Verifica se a resposta da API não contém erros.
            if (!response.data.error) {
                // Extrai a resposta da IA.
                const aiResponse = response.data.choices[0].message.content;
                // Envia a resposta da IA de volta para o cliente.
                ws.send(aiResponse);
            }
        } catch (error) {
            // Loga qualquer erro que ocorrer durante o processamento da mensagem.
            console.error('Erro ao processar mensagem:', error);
        }
    });

    // Evento disparado quando o cliente fecha a conexão.
    ws.on('close', () => {
        console.log('Cliente desconectado'); // Loga a desconexão do cliente.
    });
});

// Loga que o servidor está rodando.
console.log('Servidor rodando na porta 3000'); // Observação: O código diz "porta 8080", mas o servidor está configurado para a porta 3000.