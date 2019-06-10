<?php

namespace ModularityAgreementsArchive\Admin;

class Settings
{

    public function __construct()
    {
        if (!is_admin()) {
            return false;
        }

        add_action('acf/init', array($this, 'setupAdminPage'));
        add_filter('acf/save_post', array($this, 'saveSettings'), 1 );
    }

    /**
     * Disable Fields in Settings
     *
     * @param string $field
     *
     * @return $field (bool) disabled
     */
    public function disabledField($field)
    {
        $field['disabled'] = true;
        return $field;
    }

    /**
     * Save Settings
     * @return void
     */
    public static function saveSettings()
    {
        if( empty($_POST['acf']) ) {
            return;
        }

        //update_option('group_5be98c9780f80_mod_agreement_archive_api_host', $_POST['acf']['field_5be98c9d34843']);
        //update_option('group_5be98c9780f80_mod_agreement_archive_api_key', $_POST['acf']['field_5be98cc334844']);

    }

    /**
     * Generates a Option page in Admin
     * @return void
     */
    public function setupAdminPage()
    {
        if (function_exists('acf_add_options_page')) {
            acf_add_options_page(array(
                'page_title' => __('Agreement Archive', 'modularity-agreements-archive'),
                'menu_title' => __('Agreement Archive', 'modularity-agreements-archive'),
                'menu_slug' => 'Agreement Archive-settings',
                'capability' => 'manage_options',
                'redirect' => false,
                'post_id' => 'group_5be98c9780f80',
                'autoload' => false,
                'update_button' => __('Update', 'acf'),
                'updated_message' => __("Options Updated", 'acf'),
                'parent_slug' => 'options-general.php'
            ));
        }
    }
}
