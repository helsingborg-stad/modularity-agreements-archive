'use strict';

import queryString from 'query-string';

const singlePageParamKey = 'agreementArchiveId';

/**
 * Getting Id
 * @return (object) id
 */
const getMediaID = () => {

    let url = new URL(window.location).pathname.split('/');
    if (url.indexOf(singlePageParamKey) != -1) {
        let newUrl = {};
        Object.keys(url).forEach(function (key) {
            if (typeof url[key] != 'undefined' && url[key] != null && url[key] != '') {
                newUrl[key] = url[key];
            }
        });
        return Object.values(newUrl)[Object.values(newUrl).length - 1];
    }
};


/**
 * Changing url address
 * @return void
 */
const changeVirtualUrl = (id = false) => {

    const queryStr = queryString.parse(location.search);
    const mediaId = (queryStr.mediaId) ? queryStr.mediaId : false;
    let uri = window.location.toString();
    let buildQyery = '';
    let amp = '';

    if (uri.indexOf("?") > 0) {
        const clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        buildQyery = '?';
        amp = '&';
    }
    const stripTrailingSlash= uri.replace(/^(.+?)\/*?$/, "$1");
    const url = new URL(stripTrailingSlash).pathname.split('/');
    if (Object.keys(queryStr).length > 0 || id || url.indexOf(singlePageParamKey) != 1) {

        for (let key in queryStr) {
            buildQyery += (queryStr[key] != mediaId) ? key + '=' + queryStr[key] + amp : '';
        }

        if (url.indexOf(singlePageParamKey) != 1) {
            buildQyery += (id != false) ? uri + '/'+singlePageParamKey+'/' + id + '/' : '';
        }

        buildQyery = (buildQyery.substring(buildQyery.length - 1) == "&") ? buildQyery.substring(0, buildQyery.length - 1) : buildQyery;
        window.history.replaceState({}, document.title, buildQyery);
    }
};


/**
 * Toogle Details dependant on state
 * @return void
 */
const showDetail = (archId, view) => {

    if (view === 'single') {
        const url = new URL(window.location).pathname.split('/');
        const mediaId = (url.indexOf(singlePageParamKey) != 1) ? getMediaID() : '';
        if (!mediaId)
            changeVirtualUrl(archId);
    }
    else {
        const path = window.location.pathname.split('/');
        const mediaId = path.pop() || path.pop();
        const newPath = window.location.pathname.replace('/' + mediaId + '/', '');
        window.history.pushState({}, document.title, newPath.replace('/'+singlePageParamKey, ''));
        changeVirtualUrl();
    }
};

module.exports = {
    showDetail: showDetail,
    getMediaID: getMediaID
};