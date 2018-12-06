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
            "ModularityAgreementsArchive/v1",
            "Get",
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'fetchData')
            )
        );
    }

    /**
     * Fetch data from API
     *
     * @wp return object wp_send_json
     *
     * @return false || void
     */
    public function fetchData()
    {
        $authToken = (isset($_GET['authToken']) && !empty($_GET['authToken'])) ? str_replace('"', '', \ModularityAgreementsArchive\App::decrypt($_GET['authToken'])) : '';

        //No valid auth token
        if ($authToken != get_option('group_5be98c9780f80_mod_agreement_archive_api_token')) {
            return wp_send_json(
                array(
                    'state' => 'error',
                    'message' => __("No api-key entered, please privode one in the agreement archive settings.", 'modularity-agreements-archive')
                )
            );
        }

        //Get query vars
        $query = (isset($_GET['search']) && !empty($_GET['search'])) ? $_GET['search'] : '';
        $id = (isset($_GET['id']) && !empty($_GET['id'])) ? $_GET['id'] : '';
        $hostUrl = get_option('group_5be98c9780f80_mod_agreement_archive_api_host');

        //Create API url
        $apiUrl = $hostUrl;
        $apiUrl .= ($query) ? "/?q=" . sanitize_text_field($query) : '';
        $apiUrl .= ($id) ? "/" . $id : '';

        //Get from resource
        if ($cachedCall = wp_cache_get('ModularityAgreementsArchive', 'getCall')) {
            $apiCallReturn = $cachedCall;
        } else {
            $apiCallReturn = wp_remote_get(
                $apiUrl,
                array(
                    'headers' => array(
                        'apiKey' => get_option('group_5be98c9780f80_mod_agreement_archive_api_key')
                    )
                )
            );
            wp_cache_add('ModularityAgreementsArchive', $apiCallReturn, 'getCall', 60*15);
        }

        //Validate response, return
        if (isset($apiCallReturn['body']) && !empty($apiCallReturn['body']) && $decodedJson = json_decode($apiCallReturn['body'])) {
            wp_send_json(
                $this->cleanData($decodedJson),
                200
            );
        }

        //Not valid response above, send error
        return wp_send_json(
            array(
                'state' => 'error',
                'message' => __("A unknown error with the response occured.", 'modularity-agreements-archive')
            )
        );
    }

    /**
     * Fetch data from API
     *
     * @param array $dataArray Array containing response data
     *
     * @return false || void
     */
    public function cleanData($dataArray)
    {
        if (is_array($dataArray) && !empty($dataArray)) {
            foreach ($dataArray as &$item) {

                //Clean text content
                if (isset($item->Description)) {
                    $item->Description = preg_replace('/<br\s?\/?>/ius', "\n", str_replace("\n", "", str_replace("\r", "", htmlspecialchars_decode($item->Description))));
                }

                //Remove url
                if (isset($item->Url)) {
                    unset($item->Url);
                }
            }
        }
        return $dataArray;
    }
}




