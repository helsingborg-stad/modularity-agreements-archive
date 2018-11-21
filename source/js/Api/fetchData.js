import RenderList from '../Components/RenderList.js';
import axios from 'axios';
import {Pagination} from 'hbg-react';

module.exports = class extends React.Component {

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

    async getJsonData(type) {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/ModularityAgreementsArchiveAPI/?authToken=' + ModularityAgreementsArchiveObject.authToken + '&archiveType=';

        apiUrl += (type === 'list') ? 'list' : '';
        apiUrl += (type === 'query') ? 'search&query='+this.state.searchInput : '';
        apiUrl += (type === 'archiveId') ? 'single&archiveId='+this.state.archId : '';

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

    componentDidMount() {
        this.getJsonData('list');
    }

    updateInput(event){
        this.setState({searchInput : event.target.value})
    }

    handleSubmit(){
        this.getJsonData('query');
    }

    updateItemList(currentPage) {
        const {filteredItems} = this.state;
        const {perPage} = this.props;
        const begin = ((currentPage - 1) * perPage);
        const end = begin + perPage;

        this.setState({
            paginatedItems: filteredItems.slice(begin, end)
        });
    }

    nextPage() {
        if (this.state.currentPage === this.state.totalPages) {
            return;
        }
        const currentPage = this.state.currentPage += 1;
        this.setState({currentPage: currentPage});
        this.updateItemList(currentPage);
    }

    prevPage() {
        if (this.state.currentPage <= 1) {
            return;
        }
        const currentPage = this.state.currentPage -= 1;
        this.setState({currentPage: currentPage});
        this.updateItemList(currentPage);
    }

    paginationInput(e) {
        let currentPage = e.target.value ? parseInt(e.target.value) : '';
        currentPage = (currentPage > this.state.totalPages) ? this.state.totalPages : currentPage;
        this.setState({currentPage: currentPage});
        if (currentPage) {
            this.updateItemList(currentPage);
        }
    }

    render() {
        const {showSearch} = this.props;
        const searchStyle = ({showSearch}) ? 'grid-md-4' : 'grid-md-12';
        const {isLoaded, paginatedItems, totalPages, currentPage} = this.state;

        if (!isLoaded) {
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
                            <div className="grid-md-8 gutter">
                                <div className="searchApi input-group">
                                    <span className="input-group-addon"><i className="pricon pricon-file"></i></span>
                                    <input
                                        id="searchInput"
                                        type="text"
                                        className="form-control"
                                        onChange={this.updateInput}
                                    />
                                    <span className="input-group-addon-btn">
                                        <button type="submit" className="btn btn-primary"
                                                value="Send"
                                                onClick={this.handleSubmit}>{ModularityAgreementsArchiveObject.translation.search}</button>
                                    </span>
                                </div>
                            </div>

                            <div className={searchStyle}>
                                <div className="gutter grid">
                                    <div className="grid-fit-content u-ml-auto">
                                        <Pagination className="pagination"
                                                    current={currentPage}
                                                    total={totalPages}
                                                    next={this.nextPage.bind(this)}
                                                    prev={this.prevPage.bind(this)}
                                                    input={this.paginationInput.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RenderList
                        paginatedItems={this.state.paginatedItems}
                    />

                </div>
            );
        }
    }


};
