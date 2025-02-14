<?php
// Inclui o arquivo de configuração do Moodle (comentado para evitar erros durante o desenvolvimento).
require_once('/var/www/sites/lucas.eduead.com.br/html/ead/config.php');
require_login();

// Exibe o cabeçalho padrão do Moodle (comentado para evitar erros durante o desenvolvimento).
// echo $OUTPUT->header();

// Exibe o título da página usando a string de idioma do plugin (comentado para evitar erros durante o desenvolvimento).
// echo $OUTPUT->heading(get_string('pluginname', 'block_ia_chat'));

// Coleta o ID do curso dinamicamente (comentado para evitar erros durante o desenvolvimento).
// $courseid = optional_param('courseid', 1, PARAM_INT); // ID do curso (pode ser dinâmico).

// Query SQL para buscar os dados do curso atual.
$sql = "SELECT * FROM mdl_course where id = $COURSE->id";
// Executa a query e armazena os resultados na variável $datas.
$datas = $DB->get_records_sql($sql);

// Debug: Exibe os dados brutos (comentado para evitar saída desnecessária).
// var_dump($data);
?>

<!-- Itera sobre os dados do curso retornados pela query. -->
<?php foreach ($datas as $data): ?>
    <!-- Botão para abrir o chat. -->
    <button id="open-chat">Abrir Chat</button>

    <!-- Div que contém o mini-chat, com atributos personalizados para armazenar informações do curso. -->
    <div id="mini-chat" data-idCourse="<?= $data->id ?>" data-nameCourse="<?= $data->fullname; ?>" data-summary="<?= $data->summary; ?>" data-nameUser="<?= $USER->firstname ;?>">
    <button id="clean-chat">Limpar</button>
        <!-- Div para exibir as mensagens do chat. -->
        <div id="chat-messages"></div>

        <!-- Div para exibir uma animação de carregamento. -->
        <div id="loading">
            <img src="<?= $loading_gif_url; ?>" alt="Carregando...">
        </div>

        <!-- Div que contém a entrada de texto e o botão de enviar. -->
        <div id="user-input-container">
            <!-- Campo de entrada de texto para o usuário digitar sua dúvida. -->
            <input type="text" id="user-input" placeholder="Digite sua dúvida...">

            <!-- Botão para enviar a mensagem. -->
            <button id="send-button">
                <img src="<?= $arrowSetMessage; ?>" alt="Enviar">
            </button>
        </div>
    </div>
<?php endforeach; ?>