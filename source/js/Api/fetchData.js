import axios from 'axios';
import {Pagination} from 'hbg-react';

module.exports = class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hits: [],
            isLoading: false,
            error: null,
            filteredItems: [],
            paginatedItems: [],
            totalPages: 0,
            currentPage: 1
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const {perPage, showPagination} = this.props;
        /*let apiUrl = '/ModularityAgreementsArchiveAPI/?authToken='+authToken+'&archiveType='+archiveType;
        apiUrl += (archiveId) ? '&archiveId='+archiveId : '';
        apiUrl += (listArchive) ? '&listArchive='+listArchive : '';
        console.log(apiUrl);
        */
        let apiUrl = 'https://hn.algolia.com/api/v1/search?query=redux'; // Test url med json-data
        axios.get(apiUrl)
            .then(result => this.setState({
                hits: result.data.hits,
                isLoading: false,
                filteredItems: result.data,
                paginatedItems: result.data,
                totalPages: Math.ceil(result.data.length / perPage)
            }))
            .catch(error => this.setState({
                error,
                isLoading: false
            }));
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
        const {hits, isLoading, error, isLoaded, paginatedItems, totalPages, currentPage} = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        return (

            <ul>
                {hits.map(hit =>
                    <li key={hit.objectID}>
                        <a href={hit.url}>{hit.title}</a>
                    </li>
                )}
            </ul>

        );
    }


};
