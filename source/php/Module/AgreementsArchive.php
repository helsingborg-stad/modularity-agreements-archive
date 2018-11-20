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
        $data['perPage'] = get_option('group_5be98c9780f80_mod_agreement_archive_pagination');
        $data['showSearch'] = get_option('group_5be98c9780f80_mod_agreement_archive_search');
        $data['showPagination'] = get_option('group_5be98c9780f80_mod_agreement_archive_show_pagination');
        $data['authToken'] = \ModularityAgreementsArchive\App::encrypt(get_option('group_5be98c9780f80_mod_agreement_archive_api_token'));

        //Translation strings
        $data['translation'] = array(
            'title' => __('Modularity Agreement Archive', 'modularity-agreements-archive'),
            'number' => __('Number', 'modularity-agreements-archive'),
            'category' => __('Category', 'modularity-agreements-archive'),
            'supplier' => __('Supplier', 'modularity-agreements-archive'),
            'orgnr' => __('Orgnr', 'modularity-agreements-archive'),
            'fromdate' => __('From date', 'modularity-agreements-archive'),
            'todate' => __('To date', 'modularity-agreements-archive'),
            'buyername' => __('Buyer name', 'modularity-agreements-archive'),
            'search' => __('Search', 'modularity-agreements-archive'),
            'download' => __('Download', 'modularity-agreements-archive'),
        );

        //Send to script
        return $data;
    }

    public function style()
    {
        wp_register_style('modularity-agreements-archive-css', MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('css/modularity-agreements-archive.css'));
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
