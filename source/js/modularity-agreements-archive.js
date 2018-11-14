'use strict';
import "@babel/polyfill";
import FetchData from './Api/FetchData.js';

const JsonRenderContainer = require('./Components/list.js');
const domElement = document.getElementById('modularity-agreement-archive');

const App = class {

    constructor() {
        this.renderModule();
    }

    renderModule() {
        if (typeof(ModularityAgreementsArchiveObject) == 'undefined' || domElement == null || typeof(ModularityAgreementsArchiveObject.authToken) == 'undefined') {
            return;
        }

        let archiveId, archiveType;

        const api = new FetchData(ModularityAgreementsArchiveObject.authToken, archiveId, archiveType);

        ReactDOM.render(
            <JsonRenderContainer api={api}/>
            , domElement
        );
    }
};

new App();