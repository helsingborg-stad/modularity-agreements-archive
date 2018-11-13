<?php

namespace ModularityAgreementsArchive;

class Api extends App
{
    public function __construct()
    {
        parent::__construct();
        if (strpos($_SERVER['REQUEST_URI'], "ModularityAgreementsArchiveAPI") !== false) {
            $this->fetchData();
        }

    }

    public function fetchData()
    {
        $authToken = (isset($_GET['authToken']) && !empty($_GET['authToken'])) ? $_GET['authToken'] : false;
        $archiveId = (isset($_GET['archiveId']) && !empty($_GET['archiveId'])) ? $_GET['archiveId'] : false;
        $query = (isset($_GET['query']) && !empty($_GET['query'])) ? $_GET['query'] : false;
        $archiveType = (isset($_GET['archiveType']) && !empty($_GET['archiveType'])) ? $_GET['archiveType'] : false;

        if (self::decrypt($authToken) != get_option('_group_5be98c9780f80_mod_agreement_archive_api_encryption_key') . get_option('_group_5be98c9780f80_mod_agreement_archive_api_encryption_salt')) {
            return false;
        }

        $hostUrl = get_option('group_5be98c9780f80_mod_agreement_archive_api_host');
        $url = array(
            'single' => $hostUrl . "/" . $archiveId,
            'search' => $hostUrl . "/?q=" . isset($query),
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




