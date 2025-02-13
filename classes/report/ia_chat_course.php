<?php
// Verifica se o script está sendo acessado dentro do Moodle.
// 'MOODLE_INTERNAL' é uma constante definida pelo Moodle para garantir que o arquivo não seja acessado diretamente.
// Se não estiver definida, o script é encerrado com a função 'die()'.
defined('MOODLE_INTERNAL') || die();

/**
 * Classe block_ia_chat_report
 * 
 * Esta classe é responsável por fornecer funcionalidades relacionadas ao relatório de chat IA.
 * Atualmente, ela contém um método para buscar dados de atividades de um curso específico.
 */
class block_ia_chat_report {

    /**
     * Método get_activity_data
     * 
     * Este método busca os dados de um curso específico no banco de dados do Moodle.
     * 
     * @param int $courseid O ID do curso do qual os dados serão buscados.
     * @return array Retorna um array de objetos contendo os dados do curso.
     */
    public static function get_activity_data($courseid) {
        // Acesso à variável global $DB, que é a instância do banco de dados do Moodle.
        global $DB;

        // Query SQL para selecionar todos os campos da tabela 'mdl_course' onde o ID do curso corresponde ao fornecido.
        $sql = "SELECT * FROM mdl_course where id = $courseid";

        // Executa a query SQL e retorna os resultados.
        // 'get_records_sql' é um método do Moodle que executa a query e retorna os registros como um array de objetos.
        return $DB->get_records_sql($sql);
    }
}