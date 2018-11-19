import RenderList from '../Components/RenderList.js';
import axios from 'axios';
import {Pagination} from 'hbg-react';

module.exports = class extends React.Component {

    constructor() {
        super();

        this.state = {
            responseData: [],
            isLoaded: true,
            errors: null,
            filteredItems: [],
            paginatedItems: [],
            totalPages: 0,
            currentPage: 1
        };
    }

    async getJsonData() {
        const {perPage, showPagination} = this.props;
        let apiUrl = '/ModularityAgreementsArchiveAPI/?authToken=' + ModularityAgreementsArchiveObject.authToken + '&archiveType=list';
        console.log(perPage);
        axios
            .get(apiUrl)
            .then(response => {
                const jsonData = JSON.parse(response.data);
                this.setState({
                    responseData: jsonData,
                    isLoading: false,
                    filteredItems: jsonData,
                    paginatedItems: jsonData,
                    totalPages: Math.ceil(jsonData.length / perPage)
                });
                if (showPagination) {
                    this.updateItemList(1);
                }
            })
            .catch(error => this.setState({error, isLoading: false}));
    }

    componentDidMount() {
        this.getJsonData();
    }

    handleSearch(e) {
        let searchString = e.target.value;
        let filteredItems = this.state.items;
        const {perPage, showPagination} = this.props;

        filteredItems = filteredItems.filter((item) => {
            let title = item.title.toLowerCase();
            let content = item.content.toLowerCase();
            return title.indexOf(searchString.toLowerCase()) !== -1 || content.indexOf(searchString.toLowerCase()) !== -1;
        });

        if (showPagination) {
            this.setState({
                filteredItems,
                currentPage: 1,
                totalPages: Math.ceil(filteredItems.length / perPage)
            });
            this.updateItemList(1);
        } else {
            this.setState({
                filteredItems,
                paginatedItems: filteredItems
            });
        }
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
                <div>
                        <RenderList
                            paginatedItems={this.state.paginatedItems}
                        />

                        <div className="grid gutter">
                            <div className="grid-fit-content u-ml-auto">
                                <Pagination
                                    current={currentPage}
                                    total={totalPages}
                                    next={this.nextPage.bind(this)}
                                    prev={this.prevPage.bind(this)}
                                    input={this.paginationInput.bind(this)}
                                />
                            </div>
                        </div>
                </div>
            );
        }
    }


};
