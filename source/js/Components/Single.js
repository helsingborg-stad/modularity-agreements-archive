class Single extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="singleView">
                <button className="go-back btn btn-contrasted"
                    onClick={ (e) =>
                    this.props.tableView(e)
                    }><i className="pricon pricon-previous"></i>&nbsp;Back</button>

            </div>
        );
    }
}
export default Single;