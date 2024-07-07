<?php
/**
 * Plugin Name: EGRI-Key Features Block
 * Description: Ein benutzerdefinierter Elementor Block als Plugin.
 * Version: 1.0
 * Author: Ihr Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Kategorie "EGRI-Block" registrieren
add_action('elementor/elements/categories_registered', function ($elements_manager) {
    $elements_manager->add_category(
        'egri-block',
        [
            'title' => __('EGRI-Block', 'text-domain'),
            'icon' => 'fa fa-plug', // Optional: Wählen Sie ein passendes Icon
        ]
    );
});

// Widget registrieren
function register_custom_elementor_widget($widgets_manager)
{
    require_once (__DIR__ . '/key-features-widget.php');
    $widgets_manager->register(new \Key_Features_Widget());
}
add_action('elementor/widgets/register', 'register_custom_elementor_widget');

// CSS für den Elementor-Editor einreihen
add_action('elementor/editor/after_enqueue_styles', function () {
    wp_enqueue_style('keyfeatures-widget-styles', plugin_dir_url(__FILE__) . 'assets/css/keyfeatures-widget-styles.css');
});

// CSS für das Frontend einreihen
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('keyfeatures-widget-styles', plugin_dir_url(__FILE__) . 'assets/css/keyfeatures-widget-styles.css');
});

// JavaScript für das Frontend einreihen
add_action('wp_enqueue_scripts', function () {
    // Stellen Sie sicher, dass der Pfad korrekt ist. Überprüfen Sie den Ordner und den Dateinamen.
    wp_enqueue_script('keyfeatures-widget-script', plugin_dir_url(__FILE__) . 'assets/js/key-features-widget.js', array ('jquery'), '1.0.0', true);
});

// Optional: JavaScript nur im Elementor-Editor einreihen
add_action('elementor/editor/after_enqueue_scripts', function () {
    // Stellen Sie sicher, dass der Pfad korrekt ist. Überprüfen Sie den Ordner und den Dateinamen.
    wp_enqueue_script('keyfeatures-widget-editor-script', plugin_dir_url(__FILE__) . 'assets/js/key-features-widget.js', array ('jquery'), '1.0.0', true);
});