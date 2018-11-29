<?php

namespace ModularityAgreementsArchive\Helper;

class React
{
    public static function enqueue($version = false)
    {

        $suffix = (defined('DEV_MODE') && DEV_MODE) ? 'development' : 'production.min';
        $version = (is_string($version) && !empty($version)) ? $version : '16.4.2';

        if (!wp_script_is('react')) {
            wp_enqueue_script('react', 'https://unpkg.com/react@16/umd/react.' . $suffix . '.js', array(), null);
        }
        if (!wp_script_is('react-dom')) {
            wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@16/umd/react-dom.' . $suffix . '.js', array('react'), null);
        }
    }
}