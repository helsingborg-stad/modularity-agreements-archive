<?php

namespace ModularityAgreementsArchive\Module;

class AgreementsArchive extends \Modularity\Module
{
    public $slug = 'AgreementsArchive';
    public $supports = array();
    public $react = false;

    public function init()
    {
        $this->nameSingular = __("Modularity Agreements Archive", 'modularity-agreements-archive');
        $this->namePlural = __("Modularity Agreements Archives", 'modularity-agreements-archive');
        $this->description = __("Integrates Modularity with Primona Kommers API", 'modularity-agreements-archive');
    }

    public function data() : array
    {
        $data = array();

        //Send to view
        return $data;
    }

    public function template() : string
    {
        return "modularityAgreementsArchive.blade.php";
    }

    public function script()
    {
        $this->react = new \ModularityAgreementsArchive\Helper\React();
        $this->react::enqueue();

        wp_enqueue_script('modularity-agreements-archive-js');
        wp_localize_script('modularity-agreements-archive-js', 'ModularityAgreementsArchiveObject', $this->scriptData());
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

    public function style()
    {
        wp_enqueue_style('modularity-agreements-archive-css');
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
