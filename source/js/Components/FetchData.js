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
            archId: '',
            searchInput: '',
            view: 'table',
            switchView: false,
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSingleClick = this.handleSingleClick.bind(this);
        this.handleChangeView = this.handleChangeView.bind(this);

    }

    /**
     * Getting data from Back-end/API
     * @return void
     */
    async getJsonData(type) {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/wp-json/wp/v2/ModularityAgreementsArchive?authToken=' + ModularityAgreementsArchiveObject.authToken + '&archiveType=';

        apiUrl += (type === 'list') ? 'list' : '';
        apiUrl += (type === 'query') ? 'search&query=' + this.state.searchInput : '';
        apiUrl += (type === 'single') ? 'single&archiveId=' + this.state.archId : '';

        axios
            .get(apiUrl)
            .then(response => {
                const jsonData = JSON.parse(response.data).reverse();
                const view = (type === 'list') ? 'table' : 'single';
                this.setState({
                    responseData: jsonData,
                    isLoaded: true,
                    filteredItems: jsonData,
                    paginatedItems: jsonData,
                    totalPages: Math.ceil(jsonData.length / perPage),
                    view: view
                });

                console.log(jsonData);
                if (showPagination) {
                    let page = (this.state.switchView) ? this.state.currentPage : 1;
                    this.updateItemList(page);
                }
            })
            .catch(error => this.setState({error, isLoaded: true}));
    }

    /**
     * Mounting data onLoad
     * @return void
     */
    componentDidMount() {
        this.getJsonData('list');
        const url = new URL(window.location).pathname.split('/');
        const archiveId = (url.indexOf('archiveId') != -1) ? virtualUrl.getMediaID() : false;
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
     * Fetching singleData from API
     * @return void
     */
    handleSingleClick(e, itemId) {
        e.preventDefault();
        this.setState({archId: itemId});
        this.getJsonData('single');
    }

    /**
     * Change to table view fetch data from API
     * @return void
     */
    handleChangeView() {
        this.setState({switchView: true});
        this.setState({view: 'table'});
        this.getJsonData('list');
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
                            singleItems={this.state.paginatedItems}
                            tableView={this.handleChangeView}
                        />
                    }
                </div>
            );
        }
    }
};
