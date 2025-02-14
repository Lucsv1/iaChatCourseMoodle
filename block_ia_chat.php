<?php
// Define a classe do bloco 'ia_chat', que estende a classe base 'block_base' do Moodle.
class block_ia_chat extends block_base {
    
    /**
     * Método init
     * 
     * Inicializa o bloco, definindo o título do bloco.
     * O título é obtido a partir das strings de idioma do plugin.
     */
    public function init() {
        $this->title = get_string('pluginname', 'block_ia_chat'); // Define o título do bloco.
    }

    /**
     * Método applicable_formats
     * 
     * Define onde o bloco pode ser exibido.
     * 
     * @return array Retorna um array associativo indicando os formatos de página onde o bloco é aplicável.
     */
    public function applicable_formats() {
        return array(
            'course-view' => true, // O bloco pode ser exibido em páginas de curso.
            'site' => false,       // O bloco não pode ser exibido na página inicial do site.
            'mod' => false,       // O bloco não pode ser exibido em páginas de atividades (módulos).
            'my' => false,         // O bloco não pode ser exibido no painel do usuário (My Dashboard).
        );
    }

    /**
     * Método get_content
     * 
     * Gera o conteúdo do bloco, incluindo scripts, estilos e o HTML do chat.
     * 
     * @return object Retorna o conteúdo do bloco.
     */
    public function get_content() {
        // Acesso às variáveis globais do Moodle.
        global $PAGE, $COURSE, $DB, $USER;

        // Se o conteúdo já foi gerado, retorna o conteúdo existente.
        if ($this->content !== null) {
            return $this->content;
        }

        // Inicializa o objeto de conteúdo.
        $this->content = new stdClass();

        // Carrega os arquivos JavaScript e CSS necessários para o bloco.
        $PAGE->requires->js('/blocks/ia_chat/assets/scripts/chat.js'); // Carrega o script JavaScript.
        $PAGE->requires->css('/blocks/ia_chat/assets/style/chat.style.css'); // Carrega o arquivo CSS.

        // Define as URLs das imagens utilizadas no chat.
        $loading_gif_url = new moodle_url('/blocks/ia_chat/assets/img/Loading-PNG.gif'); // URL da imagem de carregamento.
        $arrowSetMessage = new moodle_url('/blocks/ia_chat/assets/img/setaChatIa.png'); // URL da imagem da seta.

        // Renderiza o conteúdo do arquivo chat.php.
        ob_start(); // Inicia o buffer de saída.
        include(__DIR__ . '/chat.php'); // Inclui o arquivo chat.php.
        $this->content->text = ob_get_clean(); // Captura o conteúdo do buffer e limpa.

        // Define o rodapé do bloco como vazio.
        $this->content->footer = '';

        // Retorna o conteúdo gerado.
        return $this->content;
    }
}