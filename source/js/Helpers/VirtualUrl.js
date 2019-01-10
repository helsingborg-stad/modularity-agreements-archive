'use strict';

/**
 *
 * @type {string}
 */
const singlePageParamKey = 'agreementArchiveId';
const searchAgreementArchive = 'searchAgreementArchive';


/**
 *
 * @returns {any}
 */
const getMediaID = () => {

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
 *
 * @param id
 * @param search
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
 *
 * @param archId
 * @param view
 * @param search
 * @param searchHistory
 */
const showDetail = (archId, view, search = null, searchHistory = []) => {

    window.history.replaceState({}, document.title, window.location.pathname.substring(0, window.location.pathname.lastIndexOf("searchAgreementArchive") - 1));

    (view === 'single') ? singleUrl(archId, search, searchHistory) : defaultAndSearchUrl(search);
};


/**
 *
 * @param archId
 * @param search
 * @param searchHistory
 */
const singleUrl = (archId, search = null, searchHistory = []) => {

    clearUrl(search);

    const url = new URL(window.location).pathname.split('/');
    const mediaId = (url.indexOf(singlePageParamKey) != 1) ? getMediaID() : '';

    (!mediaId) ? changeVirtualUrl(archId, search) : '';
};
/**
 *
 * @param search
 * @param searchHistory
 */
const clearUrl = (search = null) => {

    const decodeUri = decodeURIComponent(window.location.pathname);
    const removetrailingSlash = decodeUri.replace(/\/$/, '');
    const newPath = removetrailingSlash.replace('/' + search, '');

    window.history.replaceState({}, document.title, newPath.replace('/' + searchAgreementArchive, ''));
};

/**
 *
 * @param search
 */
const defaultAndSearchUrl = (search) => {

    const path = window.location.pathname.split('/');
    const mediaId = path.pop() || path.pop();
    const newPath = window.location.pathname.replace('/' + mediaId + '/', '');

    window.history.pushState({}, document.title, newPath.replace('/' + singlePageParamKey, ''));

    if (search) {
        let slash = (!window.location.pathname.match(/\/$/)) ? '/' : '';
        window.history.pushState({}, document.title, window.location.protocol + "//" + window.location.host + window.location.pathname + slash + searchAgreementArchive + '/' + search);
    }

    changeVirtualUrl();
};


/**
 *
 * @type {{getMediaID: getMediaID, showDetail: showDetail}}
 */
module.exports = {
    showDetail: showDetail,
    getMediaID: getMediaID,
    clearUrl: clearUrl
};