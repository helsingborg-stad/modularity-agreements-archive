<?php

namespace ModularityAgreementsArchive\Admin;

class Settings
{
    public static $adminPageName = 'Agreement Archive';

    public function __construct()
    {
        if (!is_admin()) {
            return false;
        }

        add_action('acf/init', array($this, 'setupAdminPage'));
        add_filter('acf/load_field/name=mod_agreement_archive_api_encryption_salt', array($this, 'disabledField'));
        add_filter('acf/load_field/name=mod_agreement_archive_api_encryption_key', array($this, 'disabledField'));
        add_filter('acf/load_field/name=mod_agreement_archive_api_token', array($this, 'disabledField'));
        add_filter( 'acf/save_post', array($this, 'generateKeys'), 1 );

    }

    /**
     * Disable Fields in Settings
     * @param $field (string)
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

        if (!get_option('group_5be98c9780f80_mod_agreement_archive_api_token')) {
            $_POST['acf']['field_5be98d1034845'] = substr(str_shuffle("0123456789&abcdefghijklm!nopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"), 0, 20);
            $_POST['acf']['field_5be98d3234846'] = substr(str_shuffle("0123456789&abcdefghijklm!nopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"), 0, 20);
            $_POST['acf']['field_5bea90756612f'] = \ModularityAgreementsArchive\App::encrypt($_POST['acf']['field_5be98d1034845'] . $_POST['acf']['field_5be98d3234846']);
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
                'page_title' => self::$adminPageName,
                'menu_title' => self::$adminPageName,
                'menu_slug' => self::$adminPageName . '-settings',
                'capability' => 'manage_options',
                'redirect' => false,
                'post_id' => 'group_5be98c9780f80',
                'autoload' => false,
                'update_button' => __('Update', 'acf'),
                'updated_message' => __("Options Updated", 'acf'),
            ));
        }
    }
}
