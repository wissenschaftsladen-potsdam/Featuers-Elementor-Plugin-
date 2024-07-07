<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Key_Features_Widget extends \Elementor\Widget_Base
{
    public function get_name()
    {
        return 'key_features_widget';
    }

    public function get_title()
    {
        return __('Key Features', 'text-domain');
    }

    public function get_icon()
    {
        return 'key-features-widget-icon';
    }

    public function get_categories()
    {
        return ['egri-block'];
    }

    protected function _register_controls()
    {
        $this->start_controls_section(
            'content_section',
            [
                'label' => __('Inhalt', 'text-domain'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'feature_image',
            [
                'label' => __('Bild', 'text-domain'),
                'type' => \Elementor\Controls_Manager::MEDIA,
                'default' => [
                    'url' => \Elementor\Utils::get_placeholder_image_src(),
                ],
            ]
        );

        $repeater->add_control(
            'feature_title',
            [
                'label' => __('Titel', 'text-domain'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => __('Feature Titel', 'text-domain'),
            ]
        );

        $repeater->add_control(
            'feature_description',
            [
                'label' => __('Beschreibung', 'text-domain'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'default' => __('Feature Beschreibung', 'text-domain'),
            ]
        );

        $this->add_control(
            'features_list',
            [
                'label' => __('Features Liste', 'text-domain'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'title_field' => '{{{ feature_title }}}',
            ]
        );

        $this->end_controls_section();
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();

        if (!empty($settings['features_list'])) {
            echo '<div class="key_features_container">';
            foreach ($settings['features_list'] as $index => $item) {
                $direction = $index % 2 === 0 ? '' : 'row-reverse';
                // Öffnen des Feature-Elements
                echo '<div class="feature" style="flex-direction: ' . $direction . ';">';
                // Einfügen des lineCanvas als erstes Kind des Feature-Elements
                echo '<canvas id="lineCanvas' . esc_attr($index) . '" class="feature-line-canvas"></canvas>';
                // Weiterer Inhalt des Feature-Elements
                echo '<img src="' . esc_url($item['feature_image']['url']) . '" alt="' . esc_attr($item['feature_title']) . '" class="pic' . esc_attr($index + 1) . '">';
                echo '<div class="tex' . esc_attr($index + 1) . '">';
                echo '<h2>' . esc_html($item['feature_title']) . '</h2>';
                echo '<p>' . esc_html($item['feature_description']) . '</p>';
                echo '</div></div>'; // Schließen des Feature-Elements
            }
            echo '</div>'; // Schließen des key_features_container
        }
    }
}