<?php

/**
 * Plugin Name:       Modularity Agreements Archive
 * Plugin URI:        https://github.com/helsingborg-stad/modularity-agreements-archive
 * Description:       Integration for agreement data provider and Wordpress
 * Version:           0.0.1
 * Author:            Johan Silvergrund
 * Author URI:        https://helsingborg.se
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       modularity-agreements-archive
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

define('MODULARITYAGREEMENTSARCHIVE_PATH', plugin_dir_path(__FILE__));
define('MODULARITYAGREEMENTSARCHIVE_URL', plugins_url('', __FILE__));
define('MODULARITYAGREEMENTSARCHIVE_TEMPLATE_PATH', MODULARITYAGREEMENTSARCHIVE_PATH . 'templates/');

load_plugin_textdomain('modularity-agreements-archive', false, plugin_basename(dirname(__FILE__)) . '/languages');

require_once MODULARITYAGREEMENTSARCHIVE_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
require_once MODULARITYAGREEMENTSARCHIVE_PATH . 'Public.php';

// Instantiate and register the autoloader
$loader = new ModularityAgreementsArchive\Vendor\Psr4ClassLoader();
$loader->addPrefix('ModularityAgreementsArchive', MODULARITYAGREEMENTSARCHIVE_PATH);
$loader->addPrefix('ModularityAgreementsArchive', MODULARITYAGREEMENTSARCHIVE_PATH . 'source/php/');
$loader->register();

// Start application
new ModularityAgreementsArchive\App();
new ModularityAgreementsArchive\Api();

// Acf auto import and export
add_action('plugins_loaded', function () {
    $acfExportManager = new \AcfExportManager\AcfExportManager();
    $acfExportManager->setTextdomain('modularity-agreements-archive');
    $acfExportManager->setExportFolder(MODULARITYAGREEMENTSARCHIVE_PATH . 'acf-fields/');
    $acfExportManager->autoExport(array(
        'modularity-agreements-archive' => 'group_5be98c9780f80',
        'modularity-agreements-archive_display' => 'group_5bf2abec3ce8a',
    ));
    $acfExportManager->import();
});
//Registers the module
add_action('plugins_loaded', function () {
    if (function_exists('modularity_register_module')) {
        modularity_register_module(
            MODULARITYAGREEMENTSARCHIVE_PATH . 'source/php/Module/',
            'AgreementsArchive'
        );
    }
});
// Add module template dir
add_filter('Modularity/Module/TemplatePath', function ($paths) {
    $paths[] = MODULARITYAGREEMENTSARCHIVE_PATH . 'source/php/Module/views/';
    return $paths;
});
