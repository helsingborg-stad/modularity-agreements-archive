<?php

namespace ModularityAgreementsArchive\Module;

/**
 * Class AgreementsArchive
 * @package ModularityAgreementsArchive\Module
 */
class AgreementsArchive extends \Modularity\Module
{
    public $slug = 'AgreementsArchive';
    public $supports = array();
    public $react = false;

    /**
     * Init - construct
     */
    public function init()
    {
        $this->nameSingular = __("Agreements Archive", 'modularity-agreements-archive');
        $this->namePlural = __("Agreements Archives", 'modularity-agreements-archive');
        $this->description = __("Integrates Modularity with Primona Kommers API", 'modularity-agreements-archive');

        add_action('wp_enqueue_scripts', array($this, 'registerScripts'));
    }

    /**
     * Data array
     *
     * @return array $data
     */
    public function data(): array
    {
        $data = array();
        return $data;
    }

    /**
     * Blade Template
     *
     * @return string
     */
    public function template(): string
    {
        return "modularityAgreementsArchive.blade.php";
    }


    /**
     * Enqueue required scripts
     * @return void
     */
    public function registerScripts()
    {
        wp_register_script('modularity-agreements-archive-js',
            MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('js/modularity-agreements-archive.js'),
            array('react', 'react-dom'));
    }


    /**
     * Adding javaScript and Localize to make variables available in dom
     *
     * @return string || void
     */
    public function script()
    {
        //Check if modularity is comatible.
        if (!class_exists('\Modularity\Helper\React')) {
            error_log("Agreements archive cannot run. This plugin requires modularity version 2.11.0 or higher.");
            return;
        }

        (!class_exists('\Modularity\Helper\React')) ? \Modularity\Helper\React::enqueue() : \ModularityAgreementsArchive\Helper\React::enqueue();

        wp_enqueue_script('modularity-agreements-archive-js');
        wp_localize_script('modularity-agreements-archive-js', 'ModularityAgreementsArchiveObject',
            $this->scriptData());
    }


    /**
     * Setting all variables for localize script
     *
     * @return array with data
     */
    public function scriptData()
    {
        $data = array();
        $data['nonce'] = wp_create_nonce('ModularityAgreementsArchive');
        $data['perPage'] = get_option('group_5be98c9780f80_mod_agreement_archive_pagination');
        $data['showSearch'] = get_option('group_5be98c9780f80_mod_agreement_archive_search');
        $data['showPagination'] = get_option('group_5be98c9780f80_mod_agreement_archive_show_pagination');
        $data['authToken'] = wp_create_nonce('wp_rest');
        $data['baseUrl'] = get_rest_url();

        //Translation strings
        $data['translation'] = array(
            'title' => __('Modularity Agreement Archive', 'modularity-agreements-archive'),
            'number' => __('Number', 'modularity-agreements-archive'),
            'category' => __('Category', 'modularity-agreements-archive'),
            'supplier' => __('Supplier', 'modularity-agreements-archive'),
            'orgnr' => __('Orgnr', 'modularity-agreements-archive'),
            'fromdate' => __('From date', 'modularity-agreements-archive'),
            'todate' => __('To date', 'modularity-agreements-archive'),
            'search' => __('Search', 'modularity-agreements-archive'),
            'download' => __('Download', 'modularity-agreements-archive'),
            'back' => __('Back', 'modularity-agreements-archive'),
            'generalInfo' => __('General information', 'modularity-agreements-archive'),
            'details' => __('Details', 'modularity-agreements-archive'),
            'periodOfValid' => __('Period of validity', 'modularity-agreements-archive'),
            'contactPerson' => __('Contact person', 'modularity-agreements-archive'),
            'contractsManager' => __('Contracts Manager', 'modularity-agreements-archive'),
            'organizationnumber' => __('Organization number', 'modularity-agreements-archive'),
            'address' => __('Address', 'modularity-agreements-archive'),
            'email' => __('E-mail', 'modularity-agreements-archive'),
            'phone' => __('Phone', 'modularity-agreements-archive'),
            'documents' => __('Documents', 'modularity-agreements-archive'),
            'file' => __('File', 'modularity-agreements-archive'),
            'fileSize' => __('File size', 'modularity-agreements-archive'),
            'next' => __('Next', 'modularity-agreements-archive'),
            'previous' => __('Previous', 'modularity-agreements-archive'),
            'yoursearch' => __('Your search gave:', 'modularity-agreements-archive'),
            'hits' => __('hits, showing page', 'modularity-agreements-archive'),
            'of' => __('of', 'modularity-agreements-archive'),
            'gave' => __('gave', 'modularity-agreements-archive'),
            'clear' => __('clear', 'modularity-agreements-archive')
        );

        //Send to script
        return $data;
    }

    /**
     * Style - Register & adding css
     *
     * @return void
     */
    public function style()
    {
        wp_register_style('modularity-agreements-archive-css',
            MODULARITYAGREEMENTSARCHIVE_URL . '/dist/' . \ModularityAgreementsArchive\Helper\CacheBust::name('css/modularity-agreements-archive.css'));
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
