<?php

namespace ModularityAgreementsArchive;

/**
 * Class App
 * @package ModularityAgreementsArchive
 */
class App
{
    /**
     * App constructor.
     */
    public function __construct()
    {
        register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
        register_activation_hook( __FILE__, 'flushRewrites' );

        add_action( 'init', array($this, 'rewriteEndpoint'));

        new \ModularityAgreementsArchive\Admin\Settings();
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
        add_rewrite_endpoint( 'searchAgreementArchive', EP_ALL );

        flush_rewrite_rules();
    }
}
