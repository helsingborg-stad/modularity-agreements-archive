<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5bf2abec3ce8a',
    'title' => 'Module agreement archive Display settings',
    'fields' => array(
        0 => array(
            'key' => 'field_5bf2ac136ded3',
            'label' => __('Show search', 'modularity-agreements-archive'),
            'name' => 'mod_agreement_archive_search',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 1,
            'ui' => 1,
            'ui_on_text' => __('Yes', 'modularity-agreements-archive'),
            'ui_off_text' => __('No', 'modularity-agreements-archive'),
        ),
        1 => array(
            'key' => 'field_5bf2ad5f7e886',
            'label' => __('Show pagination', 'modularity-agreements-archive'),
            'name' => 'mod_agreement_archive_show_pagination',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 1,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        2 => array(
            'key' => 'field_5bf2ae0b25c74',
            'label' => __('Pagination', 'modularity-agreements-archive'),
            'name' => 'mod_agreement_archive_pagination',
            'type' => 'number',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5bf2ad5f7e886',
                        'operator' => '==',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'default_value' => 10,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => 10,
            'max' => 50,
            'step' => 10,
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