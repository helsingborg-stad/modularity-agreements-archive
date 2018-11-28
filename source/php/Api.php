<?php

namespace ModularityAgreementsArchive;

class Api
{
    public function __construct()
    {
        add_action('rest_api_init', array($this, 'registerRestRoutes'));
    }

    /**
     * Registers all rest routes for fetching data from API
     *
     * @return void
     */
    public function registerRestRoutes()
    {
        register_rest_route(
            'wp/v2', '/' . 'ModularityAgreementsArchive',
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'fetchData'),
            )
        );
    }

    /**
     * Fetch data from API
     * @wp return object wp_send_json
     * @return false || void
     */
    public function fetchData()
    {
        $authToken = (isset($_GET['authToken']) && !empty($_GET['authToken'])) ? str_replace('"', '',
            \ModularityAgreementsArchive\App::decrypt($_GET['authToken'])) : '';

        if ($authToken != get_option('group_5be98c9780f80_mod_agreement_archive_api_token')) {
            return false;
        }

        $query = (isset($_GET['search']) && !empty($_GET['search'])) ? $_GET['search'] : '';
        $id = (isset($_GET['id']) && !empty($_GET['id'])) ? $_GET['id'] : '';
        $hostUrl = get_option('group_5be98c9780f80_mod_agreement_archive_api_host');

        $apiUrl = $hostUrl;
        $apiUrl .= ($query) ? "/?q=" . $query : '';
        $apiUrl .= ($id) ? "/" . $id : '';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'apiKey: ' . get_option('group_5be98c9780f80_mod_agreement_archive_api_key')
        ));

        wp_send_json(curl_exec($ch));
        curl_close($ch);
    }
}




