<?php

namespace ModularityAgreementsArchive;

class App
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'));

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
        wp_register_script('modularity-agreements-archive-js', MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('js/modularity-agreements-archive.js'), array('react', 'react-dom'));
    }


    /**
     * Flush permalinks
     * @return void
     */
    public function flushRewrites() {
        flush_rewrite_rules();
    }

    /**
     * Adding new endpoints for this app
     * @return void
     */
    public function rewriteEndpoint (){
        add_rewrite_endpoint( 'ModularityAgreementsArchiveAPI', EP_ALL );
        $this->flushRewrites();
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
     * Encrypt & decrypt data
     * @param $meth  string encrypt or decrypt
     * @param $data  mixed data to encrypt or decrypt
     * @return string
     */

    /**
     * Open SSL Encryption
     * @return encrypted/decrypted data (string)
     */
    /*public static function encryptDecrypt($action, $string) {
        $output = false;
        $encryptMethod = "AES-256-CBC";
        $secretKey = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_key');
        $secretIV = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_salt');

        $key = hash('sha256', $secretKey);
        $iv = substr(hash('sha256', $secretIV), 0, 16);

        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encryptMethod, $key, 0, $iv);
            $output = base64_encode($output);
        } else if ($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encryptMethod, $key, 0, $iv);
        }

        return $output;
    }*/

    /**
     * Generates Keys
     * @return string
     */
    public static function scrambleEggs(){
        return substr(str_shuffle("0123456789&abcdefghijklm!nopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"), 0, 20);
    }

    /**
     * Encrypt & decrypt data
     * @param $meth  string encrypt or decrypt
     * @param $data  mixed data to encrypt or decrypt
     * @return string
     */
    static function encryptDecrypt($meth, $data)
    {
        $encryptMethod = 'AES-256-CBC';
        $encryptSalt = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_salt');
        $encryptKey = get_option('group_5be98c9780f80_mod_agreement_archive_api_encryption_key');

        if ($encryptSalt && $encryptKey) {
            switch ($meth) {
                case 'encrypt':
                    return base64_encode(openssl_encrypt(json_encode($data), $encryptMethod,
                        hash('sha256', $encryptKey), 0,
                        substr(hash('sha256', $encryptSalt), 0, 16)));
                    break;
                case 'decrypt':

                    return openssl_decrypt(base64_decode($data), $encryptMethod,
                        hash('sha256', $encryptKey), 0,
                        substr(hash('sha256', $encryptSalt), 0, 16));
                    break;

            }
        } else {
            return false;
        }
    }

}
