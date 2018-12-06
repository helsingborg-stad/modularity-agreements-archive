<?php

namespace ModularityAgreementsArchive;

class App
{
    public function __construct()
    {

        register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
        register_activation_hook( __FILE__, 'flushRewrites' );

        add_action( 'init', array($this, 'rewriteEndpoint'));

        new \ModularityAgreementsArchive\Admin\Settings();
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

    /**
     * Flush permalinks
     * @return void
     */
    function flushRewrites() {
        flush_rewrite_rules();
    }

    /**
     * Adding new endpoints for direct link to details
     * @return void
     */
    public function rewriteEndpoint (){
        add_rewrite_endpoint( 'agreementArchiveId', EP_ALL );
        flush_rewrite_rules();
    }
}
