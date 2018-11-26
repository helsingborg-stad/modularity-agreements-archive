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
            'wp/v2', '/' .'ModularityAgreementsArchive',
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'fetchData'),
            )
        );
    }

    /**
     * Fetch data from API
     * @wp returns wp_send_json
     * @return false || void
     */
    public function fetchData()
    {

        $authToken = (isset($_GET['authToken']) && !empty($_GET['authToken'])) ? str_replace('"','', \ModularityAgreementsArchive\App::decrypt($_GET['authToken'])) : '';
        $archiveId = (isset($_GET['archiveId']) && !empty($_GET['archiveId'])) ? $_GET['archiveId'] : false;
        $query = (isset($_GET['query']) && !empty($_GET['query'])) ? $_GET['query'] : false;
        $archiveType = (isset($_GET['archiveType']) && !empty($_GET['archiveType'])) ? $_GET['archiveType'] : false;

        if ($authToken != get_option('group_5be98c9780f80_mod_agreement_archive_api_token')) {
            return false;
        }

        $hostUrl = get_option('group_5be98c9780f80_mod_agreement_archive_api_host');
        $url = array(
            'single' => $hostUrl . "/" . $archiveId,
            'search' => $hostUrl . "/?q=" . $query,
            'list' => $hostUrl
        );

        if ($archiveType && array_key_exists($archiveType, $url)) {

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url[$archiveType]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'apiKey: ' . get_option('group_5be98c9780f80_mod_agreement_archive_api_key')
            ));

            wp_send_json(curl_exec($ch));
            curl_close($ch);

        } else {
            wp_send_json(json_encode(
                array(
                    'status' => array(
                        'code' => 404,
                        'message' => "Sorry! No data at the moment..."
                    )
                )
            ));
        }
    }
}




