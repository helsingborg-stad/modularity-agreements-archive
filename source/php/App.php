<?php

namespace ModularityAgreementsArchive;

class App
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));

        register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
        register_activation_hook( __FILE__, 'flushRewrites' );

        add_action( 'init', array($this, 'rewriteEndpoint'));

        new \ModularityAgreementsArchive\Admin\Settings();

    }

    /**
     * Enqueue required style
     * @return void
     */
    public function enqueueStyles()
    {
        wp_register_style('modularity-agreements-archive-css', MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('css/modularity-agreements-archive.css'));
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueScripts()
    {
        wp_register_script('modularity-agreements-archive-js', MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('js/modularity-agreements-archive.js'));
        wp_localize_script('modularity-agreements-archive-js', 'fetchObject', $this->scriptData());
    }

    public function scriptData()
    {
        $data = array();
        $data['nonce'] = wp_create_nonce('ModularityAgreementsArchive');
        $data['authToken'] = get_option('group_5be98c9780f80_mod_agreement_archive_api_token');

        //Translation strings
        $data['translation'] = array(
            'foundXItems' => __('Found %s items, display page %s of %s.', 'skyfish-integration'),
            'xResults' => __('%s results, display page %s of %s.', 'skyfish-integration'),
            'search' => __('Search', 'skyfish-integration'),
            'next' => __('Next', 'skyfish-integration'),
            'previous' => __('Previous', 'skyfish-integration'),
            'download' => __('Download', 'skyfish-integration'),
        );

        //Send to script
        return $data;
    }

    /**
     * Flush permalinks
     * @return void
     */
    function flushRewrites() {
        flush_rewrite_rules();
    }

    /**
     * Adding new endpoints for this app
     * @return void
     */
    public function rewriteEndpoint (){
        add_rewrite_endpoint( 'ModularityAgreementsArchiveAPI', EP_ALL );
        flush_rewrite_rules();

    }

    /**
     * Encrypt strings
     * @return encryptDecrypt string
     */
    public static function encrypt($string)
    {
        return self::encryptDecrypt('encrypt', $string);
    }

    /**
     * Decrypt strings
     * @return decrypted string
     */
    public static function decrypt($string)
    {
        return self::encryptDecrypt('decrypt', $string);
    }

    /**
     * Open SSL Encryption
     * @return encrypted/decrypted data (string)
     */
    public static function encryptDecrypt($action, $string) {
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $secret_key = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_key');
        $secret_iv = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_salt');
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);

        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }
}
