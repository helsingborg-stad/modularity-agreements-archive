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
        add_filter('acf/load_field/name=mod_agreement_archive_api_encryption_salt', array($this, 'disabledField'));
        add_filter('acf/load_field/name=mod_agreement_archive_api_encryption_key', array($this, 'disabledField'));
        add_filter('acf/load_field/name=mod_agreement_archive_api_token', array($this, 'disabledField'));
        add_filter('acf/save_post', array($this, 'generateKeys'), 1 );
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
     * Generates Encryption keys and Token
     * @return void
     */
    public static function generateKeys()
    {
        if( empty($_POST['acf']) ) {
            return;
        }

        if (!get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_key')) {
            $_POST['acf']['field_5be98d1034845'] = \ModularityAgreementsArchive\App::scrambleEggs();
            $_POST['acf']['field_5be98d3234846'] = \ModularityAgreementsArchive\App::scrambleEggs();
            $_POST['acf']['field_5bea90756612f'] = \ModularityAgreementsArchive\App::scrambleEggs();
        }
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
