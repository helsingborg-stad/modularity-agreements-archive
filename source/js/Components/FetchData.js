import RenderTable from './RenderTable';
import Single from './Single';
import Search from './Search';
import Paginate from './Paginate';
import {Dropdown} from 'hbg-react';
import axios from 'axios';
import virtualUrl from '../Helpers/VirtualUrl';

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
            shared: false,
            searchHistory: [],
            browserEvent: false
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSingleClick = this.handleSingleClick.bind(this);
        this.resetView = this.resetView.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }


    /**
     * Mounting data onLoad
     * @return void
     */
    componentDidMount() {
        let url = new URL(window.location).pathname.split('/');
        let archiveId = (url.includes('agreementArchiveId')) ? virtualUrl.getId() : false;

        // Show
        if (archiveId) {
            this.getJsonData('id', archiveId)
        } else if (url.includes('searchAgreementArchive')) {
            let search = decodeURIComponent(url.reverse()[0]);
            this.setState({
                searchInput: search,
                isLoaded: true
            }, () => {
                document.getElementById('searchInput').value = search;
                this.handleSubmit();
            });
        } else {
            this.getJsonData(false, false);
        }

        this.windowHistory();
    }


    /**
     * Handling Browser back button on unmount
     * @return void
     */
    componentWillUnmount() {
        window.onpopstate = () => {

        }
    }


    /**
     * Handling Browser back button on did mount
     * @return void
     */
    componentDidUpdate() {
        this.windowHistory();
    }


    /**
     * Handling Browser back button
     * @return void
     */
    windowHistory() {
        window.onpopstate = (e) => {
            e.preventDefault();

            this.setState({
                browserEvent: true,
            });

            if (this.state.archId != null) {
                this.setState({shared: true});
                this.resetView();
                history.go(1);
            }
        }
    }


    /**
     * Getting data from Back-end/API
     * @param type
     * @param archiveId
     * @return void
     */
    getJsonData(type = false, archiveId = false) {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/wp-json/ModularityAgreementsArchive/v1/Get/?authToken=' + ModularityAgreementsArchiveObject.authToken;

        apiUrl += (type === 'query') ? '&search=' + this.state.searchInput : '';
        apiUrl += (type === 'id') ? '&id=' + archiveId : '';

        (archiveId)
            ? this.setState({archId: archiveId, view: 'single', shared: true, isLoaded: false})
            : this.setState({archId: null, view: 'table', isLoaded: false});
        (type === 'query')
            ? this.setState({
                search: true,
                currentPage: 1,
                searchHistory: this.state.searchHistory.concat([this.state.searchInput])
            })
            : false;

        axios
            .get(apiUrl)
            .then(json => {
                const jsonData = json.data.reverse();
                this.setState({
                    responseData: jsonData,
                    isLoaded: true,
                    filteredItems: jsonData,
                    paginatedItems: jsonData,
                    totalPages: Math.ceil(jsonData.length / perPage),
                    view: this.state.view,
                    totalItems: jsonData.length
                });

                if (showPagination) {
                    let page = (this.state.switchView || this.state.browserEvent) ? this.state.currentPage : 1;
                    this.updateItemList(page);
                }
            })
            .catch(error => this.setState({error, isLoaded: true}));

    }


    /**
     * Fetching show single page view with detailed information
     * @param e event
     * @param itemId int
     * @return void
     */
    handleSingleClick(e, itemId) {
        e.preventDefault();
        this.showSingleDetails(itemId);
    }


    /**
     * Show detailed information
     * @param itemId (int)
     * @return void
     */
    showSingleDetails(itemId) {

        this.getJsonData('id', itemId);

        this.setState({
            isLoaded: false,
            view: 'single',
            archId: itemId,
        });

        const element = document.getElementById('modularity-agreement-archive');

        window.scrollTo({
            'left': 0,
            'top': element.offsetTop + 100
        });

        virtualUrl.showDetail(itemId, 'single');
        this.state.browserEvent = false;
    }


    /**
     * Change back to table view
     * @return void
     */
    resetView() {
        let loaded = true;

        if (this.state.shared) {
            (!this.state.searchInput) ? this.getJsonData(false, false) : this.getJsonData('query', this.state.searchInput);
            loaded = false;
        }

        this.setState({
            isLoaded: loaded,
            filteredItems: this.state.responseData,
            view: 'table',
            searchInput: this.state.searchInput,
            archId: null,
            switchView: false,
            searchView: false,
            shared: false
        });

        (this.state.searchInput) ? virtualUrl.showDetail('', 'table', this.state.searchInput, this.state.searchHistory) : virtualUrl.showDetail('', 'table', '');
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
        this.setState({archId: null, view: 'table', currentPage: 1});
        this.getJsonData('query');

        if (this.state.searchInput)
            virtualUrl.showDetail('', 'table', this.state.searchInput, this.state.searchHistory);
    }


    /**
     * Clear search input and states
     * @return void
     */
    clearSearch() {
        virtualUrl.clearUrl(this.state.searchInput, this.state.searchHistory);

        this.setState({
            search: false,
            searchInput: '',
            searchHistory: []
        });

        document.getElementById('searchInput').value = '';
        this.getJsonData(false, false);
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
        {
            ModularityAgreementsArchiveObject.translation.previous
        }
        
        let dropDownItems = [];
        this.state.responseData.map(item => (
            dropDownItems.push(item.Category)
        ));
        dropDownItems = Array.from(new Set(dropDownItems));

        return (
            <div className="renderTable">
                <div className="grid">
                    {(this.state.view != 'single') ?
                        <Search
                            change={this.updateInput}
                            submit={this.handleSubmit}
                            value={this.state.searchInput}
                            view={this.state.view}
                            totalPages={this.state.totalPages}
                            totalItems={this.state.totalItems}
                            current={this.state.currentPage}
                            input={this.paginationInput.bind(this)}
                            search={this.state.search}
                            searchInput={this.state.searchInput}
                            isLoaded={this.state.isLoaded}
                            searchHistory={this.state.searchHistory[this.state.searchHistory.length - 1]}
                            clearSearch={this.clearSearch.bind(this)}
                        />


                        : ''}

                    {this.state.isLoaded ?
                        <div className="grid-md-2">
                            <Dropdown title={ModularityAgreementsArchiveObject.translation.category}>
                                {dropDownItems.map(item => (
                                    <a
                                        onClick={() => {
                                            console.log(item);
                                        }}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </Dropdown>
                        </div>

                        : ''}


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
                        isLoaded={this.state.isLoaded}
                    />
                    :
                    (this.state.isLoaded) ?
                        <Single
                            singleItems={this.state.filteredItems}
                            tableView={this.resetView}
                            isLoaded={this.state.isLoaded}
                        />
                        : <div>
                            <div className="gutter">
                                <div className="loading">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                }
                {(this.state.view != 'single') ?
                    <div className="grid">
                        <Paginate
                            current={this.state.currentPage}
                            total={this.state.totalPages}
                            next={this.nextPage.bind(this)}
                            prev={this.prevPage.bind(this)}
                            input={this.paginationInput.bind(this)}
                            view={this.state.view}
                        />
                    </div>
                    : ''}
            </div>
        );
    }
};
