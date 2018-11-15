'use strict';
import "@babel/polyfill";
import FetchData from './Api/FetchData.js';

const domElement = document.getElementById('modularity-agreement-archive');

const App = class {

    constructor() {
        this.renderModule();
    }

    renderModule() {
        if (typeof(ModularityAgreementsArchiveObject) == 'undefined' || domElement == null || typeof(ModularityAgreementsArchiveObject.authToken) == 'undefined') {
            return;
        }

        ReactDOM.render(
            <FetchData token={ModularityAgreementsArchiveObject.authToken}/>
            , domElement
        );
    }
};

new App();