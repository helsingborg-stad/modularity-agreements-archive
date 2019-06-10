<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5be98c9780f80',
    'title' => 'Modularity agreements archive API',
    'fields' => array(
        0 => array(
            'key' => 'field_5be98c9d34843',
            'label' => __('Api Host', 'modularity-agreements-archive'),
            'name' => 'mod_agreement_archive_api_host',
            'type' => 'url',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => __('Write the Url to the API', 'modularity-agreements-archive'),
        ),
        1 => array(
            'key' => 'field_5be98cc334844',
            'label' => __('API Key', 'modularity-agreements-archive'),
            'name' => 'mod_agreement_archive_api_key',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => __('Add API key', 'modularity-agreements-archive'),
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'Agreement Archive-settings',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 1,
    'description' => '',
));
}