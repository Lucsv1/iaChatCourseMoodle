
let ws;  // Variável que armazenará a instância do WebSocket
const SERVER_URL = `wss://${window.location.host}/ead/ws`;  // URL do servidor WebSocket
const MAX_RETRIES = 3;  // Número máximo de tentativas de reconexão
let retryCount = 0;  // Contador de tentativas de reconexão
let reconnectTimeout;  // Variável para armazenar o timeout de reconexão
let confirmMessage = true;  // Flag para controlar o envio de mensagens

const loading = document.getElementById('loading');  // Elemento de loading da interface

// Obtém informações do curso dos atributos data do elemento mini-chat
let nameCourse = document.querySelector("#mini-chat").getAttribute('data-nameCourse');
let descriptionCourse = document.querySelector("#mini-chat").getAttribute('data-summary');

// Prompt inicial que será enviado com cada mensagem do usuário
const promptInit = `Prompt: Em portugues(PT-BR): Você é um assistente virtual especializado em ajudar alunos com dúvidas sobre a matéria do curso, voce nao pode dar resposta de questões, o certo é explicar como a questao o problema pode talvez ser resolvido. Seu objetivo é fornecer explicações claras, exemplos práticos e orientações úteis para ajudar os alunos a entenderem melhor os conceitos abordados no curso. Curso: ${nameCourse}, decrição do curso: ${descriptionCourse}`;


function connectWebSocket() {

    // Obtém referências aos elementos do DOM necessários
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('user-input');

    // Limpa timeout de reconexão existente
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
    }

    // Cria nova conexão WebSocket
    ws = new WebSocket(SERVER_URL);

    // Define um timeout de 5 segundos para a conexão
    const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
            console.log('Timeout na conexão');
            ws.close();
        }
    }, 5000);

    ws.onopen = () => {
        console.log('Conectado ao servidor');
        clearTimeout(connectionTimeout);
        retryCount = 0;

        // Envia ping a cada 20 segundos para manter a conexão ativa
        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 20000);
    };

    ws.onmessage = (event) => {
        // Processa mensagem recebida do servidor
        loading.style.display = 'none';
        messagesContainer.innerHTML += `<p style="text-align: justify; align-self: flex-end;">
            <strong style="text-align: end;">IA:</strong> ${event.data}</p>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        confirmMessage = true;
    };

    ws.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        document.getElementById('connection-status').innerHTML = 'Erro na conexão';
    };

    ws.onclose = (event) => {
        console.log('Conexão fechada. Código:', event.code, 'Razão:', event.reason);
        document.getElementById('connection-status').innerHTML = 'Desconectado';

        // Lógica de reconexão
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Tentando reconectar... Tentativa ${retryCount}`);
            reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
    };

    document.getElementById('open-chat').addEventListener('click', function () {
        const miniChat = document.getElementById('mini-chat');
        miniChat.style.display = miniChat.style.display === 'none' ? 'block' : 'none';
    });

    function setMessage(message) {
        if (message !== "") {
            if (confirmMessage) {
                // Adiciona mensagem do usuário ao chat
                messagesContainer.innerHTML += `<p style="align-self: flex-start;">
                    <strong style="color:black;">Você:</strong>${message}</p>`;

                loading.style.display = 'block';
                confirmMessage = false;

                // Envia mensagem para o servidor com o prompt inicial
                ws.send(JSON.stringify({
                    message: promptInit + "  Menssagem do aluno:" + message
                }));
            }
        }
    }

    // Listener para tecla Enter
    document.getElementById('user-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const message = this.value;
            setMessage(message);
            this.value = "";
        }
    });

    // Listener para botão de enviar
    document.getElementById('send-button').addEventListener('click', function (e) {
        const message = document.getElementById('user-input').value;
        setMessage(message);
        document.getElementById('user-input').value = "";
    });

}

// Inicia a conexão WebSocket quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', connectWebSocket);