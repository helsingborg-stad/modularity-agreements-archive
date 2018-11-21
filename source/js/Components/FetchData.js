import RenderTable from './RenderTable.js';
import Search from './Search.js';
import Paginate from './Paginate.js';
import axios from 'axios';

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
            searchInput: ''
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    /**
     * Getting data from Back-end/API
     * @return void
     */
    async getJsonData(type) {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/ModularityAgreementsArchiveAPI/?authToken=' + ModularityAgreementsArchiveObject.authToken + '&archiveType=';

        apiUrl += (type === 'list') ? 'list' : '';
        apiUrl += (type === 'query') ? 'search&query=' + this.state.searchInput : '';
        apiUrl += (type === 'archiveId') ? 'single&archiveId=' + this.state.archId : '';

        axios
            .get(apiUrl)
            .then(response => {
                const jsonData = JSON.parse(response.data).reverse();
                this.setState({
                    responseData: jsonData,
                    isLoaded: true,
                    filteredItems: jsonData,
                    paginatedItems: jsonData,
                    totalPages: Math.ceil(jsonData.length / perPage)
                });
                if (showPagination) {
                    this.updateItemList(1);
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
                <div className="renderList">
                    <div className="container-fluid">
                        <div className="grid">
                            <Search
                                change={this.updateInput}
                                click={this.handleSubmit}
                            />
                            <Paginate
                                showSearch={this.props.showSearch}
                                current={this.state.currentPage}
                                total={this.state.totalPages}
                                next={this.nextPage.bind(this)}
                                prev={this.prevPage.bind(this)}
                                input={this.paginationInput.bind(this)}
                            />
                        </div>
                    </div>

                    <RenderTable
                        paginatedItems={this.state.paginatedItems}
                    />

                </div>
            );
        }
    }
};
