'use strict';

/**
 * path variables
 * @type {string}
 */
const singlePageParamKey = 'agreementArchiveId';
const searchAgreementArchive = 'searchAgreementArchive';




/**
 * Article id
 * @returns {any}
 */
const getId = () => {
    let url = new URL(window.location).pathname.split('/');

    if (url.indexOf(singlePageParamKey) != -1) {
        let newUrl = {};

        Object.keys(url).forEach(function (key) {
            (typeof url[key] != 'undefined' && url[key] != null && url[key] != '') ? newUrl[key] = url[key] : '';
        });

        return Object.values(newUrl)[Object.values(newUrl).length - 1];
    }
};


/**
 * Rewrite browser url
 * @param id
 * @param search
 * @return void
 */
const changeVirtualUrl = (id = null, search = null) => {
    let buildQyery = null;

    if (search != null) {
        const newPath = window.location.pathname.replace('/' + search + '/', '');
        window.history.pushState({}, document.title, newPath.replace('/' + singlePageParamKey, ''));
    }

    if (id != null) {
        let uri = window.location.toString();
        buildQyery = uri.replace(/^(.+?)\/*?$/, "$1") + '/' + singlePageParamKey + '/' + id + '/';
    }

    (buildQyery != null) ? window.history.replaceState({}, document.title, buildQyery) : '';

};


/**
 * Display details
 * @param archId
 * @param view
 * @param search
 * @param searchHistory
 * @return void
 */
const showDetail = (archId, view, search = null) => {
    window.history.replaceState({}, document.title, window.location.pathname.substring(0, window.location.pathname.lastIndexOf("searchAgreementArchive") - 1));
    (view === 'single') ? singleUrl(archId, search) : defaultAndSearchUrl(search);
};


/**
 * Rewrite url for single page view
 * @param archId
 * @param search
 * @param searchHistory
 * @return void
 */
const singleUrl = (archId, search = null) => {
    clearUrl(search);

    const url = new URL(window.location).pathname.split('/');
    const artId = (url.includes('singlePageParamKey')) ? getId() : '';

    (!artId) ? changeVirtualUrl(archId, search) : '';
};


/**
 * Clear rewrite url
 * @param search
 * @param searchHistory
 * @return void
 */
const clearUrl = (search = null) => {
    const decodeUri = decodeURIComponent(window.location.pathname);
    const removetrailingSlash = decodeUri.replace(/\/$/, '');
    const newPath = removetrailingSlash.replace('/' + search, '');

    window.history.replaceState({}, document.title, newPath.replace('/' + searchAgreementArchive, ''));
};


/**
 * Rewrite url for search and default view
 * @param search
 * @return void
 */
const defaultAndSearchUrl = (search) => {
    const path = window.location.pathname.split('/');
    const artId = path.pop() || path.pop();
    const newPath = window.location.pathname.replace('/' + artId + '/', '');

    window.history.pushState({}, document.title, newPath.replace('/' + singlePageParamKey, ''));

    if (search) {
        let slash = (!window.location.pathname.match(/\/$/)) ? '/' : '';
        window.history.pushState({}, document.title, window.location.protocol + "//" + window.location.host + window.location.pathname + slash + searchAgreementArchive + '/' + search);
    }

    changeVirtualUrl();
};


/**
 *
 * @type {{clearUrl: clearUrl, getId: getId, showDetail: showDetail}}
 */
module.exports = {
    showDetail: showDetail,
    getId: getId,
    clearUrl: clearUrl
};