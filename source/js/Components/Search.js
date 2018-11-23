class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="grid-md-8 gutter">
                <div className="searchApi input-group">
                    <span className="input-group-addon"><i className="pricon pricon-file"></i></span>
                    <input
                        id="searchInput"
                        type="text"
                        className="form-control"
                        onChange={ () =>
                            this.props.change(document.getElementById("searchInput").value)
                        }
                    />
                    <span className="input-group-addon-btn">
                    <button type="submit"
                            className="btn btn-primary"
                            value="Send"
                            onClick={ () =>
                                this.props.click()
                            }
                    >
                    {ModularityAgreementsArchiveObject.translation.search}
                    </button>
                    </span>
                </div>
            </div>
        );
    }

}

export default Search;