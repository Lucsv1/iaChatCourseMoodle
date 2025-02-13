<?php
// Verifica se o script está sendo acessado dentro do Moodle.
// 'MOODLE_INTERNAL' é uma constante definida pelo Moodle para garantir que o arquivo não seja acessado diretamente.
// Se não estiver definida, o script é encerrado com a função 'die()'.
defined('MOODLE_INTERNAL') || die();

// Define as capacidades (permissões) relacionadas ao bloco 'ia_chat'.
$capabilities = array(
    // Capacidade 'addinstance': Permite adicionar uma instância do bloco 'ia_chat' em um curso ou página.
    'block/ia_chat:addinstance' => array(
        // Define os riscos associados a essa capacidade.
        // RISK_SPAM: Indica que a capacidade pode ser usada para enviar spam.
        // RISK_XSS: Indica que a capacidade pode ser usada para injetar scripts maliciosos (XSS).
        'riskbitmask' => RISK_SPAM | RISK_XSS,

        // Define o tipo de capacidade. 'write' indica que a capacidade envolve alterações no sistema.
        'captype' => 'write',

        // Define o nível de contexto em que a capacidade se aplica.
        // CONTEXT_BLOCK: A capacidade se aplica no contexto de um bloco.
        'contextlevel' => CONTEXT_BLOCK,

        // Define quais papéis (roles) têm permissão para essa capacidade.
        'archetypes' => array(
            'editingteacher' => CAP_ALLOW, // Professores editores têm permissão.
            'manager' => CAP_ALLOW, // Gerentes (administradores) têm permissão.
        ),
    ),
);