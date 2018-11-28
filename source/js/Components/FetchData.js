import RenderTable from './RenderTable.js';
import Single from './Single.js';
import Search from './Search.js';
import Paginate from './Paginate.js';
import axios from 'axios';
import virtualUrl from '../Helpers/VirtualUrl.js';

module.exports = class extends React.Component {

    /**
     * Init
     * @return void
     */
    constructor() {
        super();

        this.state = {
            responseData: [],
            isLoaded: false,
            errors: null,
            filteredItems: [],
            paginatedItems: [],
            totalPages: 0,
            currentPage: 1,
            archId: null,
            searchInput: '',
            view: 'table',
            switchView: false,
            shared: false
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSingleClick = this.handleSingleClick.bind(this);
        this.resetView = this.resetView.bind(this);
    }

    /**
     * Mounting data onLoad
     * @return void
     */
    componentDidMount() {
        let url = new URL(window.location).pathname.split('/');
        let archiveId = (url.indexOf('agreementArchiveId') != -1) ? virtualUrl.getMediaID() : false;
        (archiveId) ? this.getJsonData('id', archiveId) : this.getJsonData(false, false);
    }

    /**
     * Getting data from Back-end/API
     * @return void
     */
    getJsonData(type = false, archiveId) {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/wp-json/wp/v2/ModularityAgreementsArchive?authToken=' + ModularityAgreementsArchiveObject.authToken;

        apiUrl += (type === 'query') ? '&search=' + this.state.searchInput : '';
        apiUrl += (type === 'id') ? '&id=' + archiveId : '';

        (archiveId) ? this.setState({archId : archiveId, view: 'single', shared: true, isLoaded: false}) : this.setState({archId : null, view: 'table', isLoaded: false});

        axios
            .get(apiUrl)
            .then(response => {
                const jsonData = JSON.parse(response.data).reverse();
                this.setState({
                    responseData: jsonData,
                    isLoaded: true,
                    filteredItems: jsonData,
                    paginatedItems: jsonData,
                    totalPages: Math.ceil(jsonData.length / perPage),
                    view: this.state.view
                });

                if (showPagination) {
                    let page = (this.state.switchView) ? this.state.currentPage : 1;
                    this.updateItemList(page);
                }
            })
            .catch(error => this.setState({error, isLoaded: true}));
    }

    /**
     * Fetching show single page view with detailed information
     * @return void
     */
    handleSingleClick(e, itemId) {
        e.preventDefault();
        this.showSingleDetails(itemId);
    }

    showSingleDetails(itemId) {
        let singleItem = this.state.responseData.filter(function (i) {
            return i.Id === itemId;
        });

        this.setState({
            isLoaded: true,
            filteredItems: singleItem,
            view: 'single',
            archId: itemId
        });
        virtualUrl.showDetail(itemId, 'single');
    }

    /**
     * Change back to table view
     * @return void
     */
    resetView() {
        let loaded = true;
        if (this.state.shared) {
            this.getJsonData(false, false)
            loaded = false;
        }

        this.setState({
            isLoaded: loaded,
            filteredItems: this.state.responseData,
            view: 'table',
            searchInput: '',
            archId: '',
            switchView: false,
            searchView: false,
            shared: false
        });

        virtualUrl.showDetail('', 'table');
    }

    /**
     * Updating state from search input
     * @param event (string) Search input value from Search Component
     * @return void
     */
    updateInput(event) {
        this.setState({searchInput: event});
    }


    /**
     * Submiting data from state to API
     * @return void
     */
    handleSubmit() {
        this.setState({archId : '', view: 'table'});
        this.getJsonData('query');
    }

    /**
     * Updating state from search input
     * @param event (string) Search input value from Search Component
     * @return void
     */
    updateInput(event) {
        this.setState({searchInput: event});
    }


    /**
     * Submiting data from state to API
     * @return void
     */
    handleSubmit() {
        this.getJsonData('query');
    }


    /**
     * Accordion - Updating list, depending on settings in db and page
     * @param currentPage (int) value from state or static param
     * @return void
     */
    updateItemList(currentPage) {
        const {filteredItems} = this.state;
        const {perPage} = this.props;
        const begin = ((currentPage - 1) * perPage);
        const end = begin + perPage;

        this.setState({
            paginatedItems: filteredItems.slice(begin, end)
        });
    }

    /**
     * Accordion - Next page
     * @return void
     */
    nextPage() {
        if (this.state.currentPage === this.state.totalPages) {
            return;
        }
        const currentPage = this.state.currentPage += 1;
        this.setState({currentPage: currentPage});
        this.updateItemList(currentPage);
    }

    /**
     * Accordion - Previous page
     * @return void
     */
    prevPage() {
        if (this.state.currentPage <= 1) {
            return;
        }
        const currentPage = this.state.currentPage -= 1;
        this.setState({currentPage: currentPage});
        this.updateItemList(currentPage);
    }

    /**
     * Accordion - Pagination input (page navigation)
     * @param e (int) value from pagination input
     * @return void
     */
    paginationInput(e) {
        let currentPage = e.target.value ? parseInt(e.target.value) : '';
        currentPage = (currentPage > this.state.totalPages) ? this.state.totalPages : currentPage;
        this.setState({currentPage: currentPage});
        if (currentPage) {
            this.updateItemList(currentPage);
        }
    }

    /**
     * Render jsx
     * @return Render to javaScript
     */
    render() {

        const view = this.state.view;
        if (!this.state.isLoaded) {
            return (
                <div className="gutter">
                    <div className="loading">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            );
        } else {
            return (

                <div className="renderTable">
                    <div className="grid">
                        <Search
                            change={this.updateInput}
                            click={this.handleSubmit}
                        />
                        {(this.state.view != 'single') ?
                            <Paginate
                                showSearch={this.props.showSearch}
                                current={this.state.currentPage}
                                total={this.state.totalPages}
                                next={this.nextPage.bind(this)}
                                prev={this.prevPage.bind(this)}
                                input={this.paginationInput.bind(this)}
                                view={this.state.view}
                            />
                            : ''}
                    </div>

                    {(view === 'table') ?
                        <RenderTable
                            paginatedItems={this.state.paginatedItems}
                            single={this.handleSingleClick}
                        />
                        :
                        <Single
                            singleItems={this.state.filteredItems}
                            tableView={this.resetView}
                        />
                    }
                </div>
            );
        }
    }
};