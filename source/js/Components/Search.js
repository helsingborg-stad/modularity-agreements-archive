import {Pagination} from "./Paginate";

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="grid-md-6 gutter">
                <div className="searchApi input-group">
                    <span className="input-group-addon"><i className="pricon pricon-file"></i></span>
                    <input
                        value={this.props.value}
                        id="searchInput"
                        type="text"
                        className="form-control"
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                this.props.submit();
                                ev.preventDefault();
                            }
                        }}
                        onChange={ () =>
                            this.props.change(document.getElementById("searchInput").value)
                        }
                    />
                    <span className="input-group-addon-btn">
                    <button type="submit"
                            className="btn btn-primary"
                            value="Send"
                            onClick={() =>
                                this.props.submit()
                            }
                    >
                    {ModularityAgreementsArchiveObject.translation.search}
                    </button>
                    </span>
                </div>
                {(this.props.search) ?
                <div className="searchResult">
                    {ModularityAgreementsArchiveObject.translation.yoursearch} <b>{this.props.totalItems}</b>&nbsp;
                    {ModularityAgreementsArchiveObject.translation.hits}&nbsp;<b>{this.props.current}</b>&nbsp;
                    {ModularityAgreementsArchiveObject.translation.of}&nbsp;<b>{this.props.totalPages}</b></div>
                 : ''}
            </div>

        );
    }

}

export default Search;