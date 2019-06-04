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

        $authToken = (isset($_GET['authToken']) && !empty($_GET['authToken'])) ? str_replace('"', '',
            \ModularityAgreementsArchive\App::decrypt($_GET['authToken'])) : '';

        //No valid auth token
        if ($authToken != get_option('group_5be98c9780f80_mod_agreement_archive_api_token')) {
            return wp_send_json(
                array(
                    'state' => 'error',
                    'message' => __("No api-key entered, please provide one in the agreement archive settings.",
                        'modularity-agreements-archive')
                )
            );
        }

        //Get query vars
        $query = (isset($_GET['search']) && !empty($_GET['search'])) ? $_GET['search'] : '';
        $id = (isset($_GET['id']) && !empty($_GET['id'])) ? $_GET['id'] : '';
        $category = (isset($_GET['category']) && !empty($_GET['category'])) ? urldecode($_GET['category']) : '';
        $hostUrl = get_option('group_5be98c9780f80_mod_agreement_archive_api_host');

        //Create API url
        $apiUrl = $hostUrl;
        $apiUrl .= ($query) ? "/?q=" . sanitize_text_field($query) : '';
        $apiUrl .= ($id) ? "/" . $id : '';

        //Get from resource
        if ($cachedCall = wp_cache_get('ModularityAgreementsArchive', 'getCall' . md5($apiUrl))) {
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
            wp_cache_add('ModularityAgreementsArchive', $apiCallReturn, 'getCall' . md5($apiUrl), 60 * 60);
        }

        //Validate response, return
        if (isset($apiCallReturn['body']) && !empty($apiCallReturn['body']) && $decodedJson = json_decode($apiCallReturn['body'])) {

            if ($category) {
                $i=0;
                foreach($decodedJson as $element) {
                    if($category !== $element->Buyer->Name){
                        unset($decodedJson[$i]);
                    }
                    $i++;
                }
            }

            wp_send_json(
                $this->cleanData(array_values($decodedJson)),
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

                    //Decode html
                    $item->Description = html_entity_decode($item->Description);

                    //Remove br's
                    $item->Description = str_ireplace(array("<br />", "<br>", "<br/>"), "\r\n", $item->Description);

                    //Handle as text area
                    $item->Description = sanitize_textarea_field($item->Description);

                    //Format url's
                    $item->Description = $this->formatUrlsInText($item->Description);

                    //Detect titles / paragraphs
                    if ($data = explode("\n", $item->Description)) {

                        if (is_array($data) && !empty($data)) {

                            //Remove empty explodes
                            $data = array_filter($data);

                            //Detect uppercase, handle them as titles
                            foreach ($data as &$element) {
                                if (trim($element) == mb_strtoupper(trim($element)) && trim($element) != "") {
                                    $element = '<h3>' . mb_convert_case(mb_strtolower(trim($element)), MB_CASE_TITLE,
                                            "UTF-8") . '</h3>';
                                } elseif (count(explode(" ", $element)) == 1 && !in_array(substr($element, 0, 1),
                                        array("•", "-")) && trim($element) != "") {
                                    $element = '<h3>' . mb_convert_case(mb_strtolower(trim($element)), MB_CASE_TITLE,
                                            "UTF-8") . '</h3>';
                                }
                            }

                            //Detect dashes leading lists, handle them as lists
                            foreach ($data as &$element) {
                                if (substr($element, 0, 1) == "-") {
                                    $element = '<span class="list-item">' . $element . '</span>';
                                }
                            }

                            //Smack it togheter again
                            $item->Description = implode("\n\n", $data);
                        }
                    }

                    //The content filter
                    $item->Description = apply_filters('the_content', $item->Description);
                }

                //Remove url
                if (isset($item->Url)) {
                    unset($item->Url);
                }

                //Streamlines categories
                if (isset($item->Category)) {
                    $item->Category = ucfirst(mb_strtolower($item->Category));
                }
            }
        }

        return $dataArray;
    }

    /**
     * Format url's automatically
     *
     * @param string $text Input text
     *
     * @return string
     */
    public function formatUrlsInText($text)
    {
        $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
        preg_match_all($reg_exUrl, $text, $matches);
        $usedPatterns = array();

        foreach ($matches[0] as $pattern) {
            if (!array_key_exists($pattern, $usedPatterns)) {
                $usedPatterns[$pattern] = true;
                $text = str_replace($pattern,
                    '<a href="' . $pattern . '" rel="nofollow" target="_blank">' . $pattern . '</a> ', $text);
            }
        }
        return $text;
    }
}




