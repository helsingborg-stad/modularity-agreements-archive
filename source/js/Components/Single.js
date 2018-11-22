class Single extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="singleView container-fluid" items={singleItems}>
                {singleItems.map((item, i) => (
                <div className="grid">
                    <div className="grid-md-2">
                    <button className="go-back btn btn-contrasted"
                            onClick={(e) =>
                                this.props.tableView(e)
                            }><i className="pricon pricon-previous"></i>&nbsp;Back
                    </button>
                    </div>

                    <div className="grid-md-6">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">Details</h4>
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th>First column</th>
                                    <th>Second column</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>This is</td>
                                    <td>a box panel</td>
                                </tr>
                                <tr>
                                    <td>Displaying</td>
                                    <td>a table</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="grid-s-12 grid-md-6">
                            <div className="c-card">
                                <h4 className="c-card__header">
                                    Card with list
                                </h4>
                                <ul className="c-list c-list--flush">
                                    <div className="c-list__item">
                                        Tellus Inceptos Commodo
                                    </div>
                                    <div className="c-list__item">
                                        Tortor Pharetra Aenean Condimentum
                                    </div>
                                    <div className="c-list__item">
                                        Condimentum Ipsum
                                    </div>
                                    <div className="c-list__item">
                                        Tortor Justo Quam
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-s-12 grid-md-6">
                            <div className="c-card">
                                <h4 className="c-card__header">
                                    Card with list
                                </h4>
                                <div className="c-list c-list--flush">
                                    <a href="#" className="c-list__item c-list__action">
                                        Tellus Inceptos Commodo
                                    </a>
                                    <a href="#" className="c-list__item c-list__action">
                                        Tortor Pharetra Aenean Condimentum
                                    </a>
                                    <a href="#" className="c-list__item c-list__action">
                                        Condimentum Ipsum
                                    </a>
                                    <a href="#" className="c-list__item c-list__action">
                                        Tortor Justo Quam
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        );
    }
}

export default Single;