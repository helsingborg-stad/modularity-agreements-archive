//import Accordion from './Accordion';

module.exports = class extends React.Component {
    constructor(props) {

        super(props);
        const {authToken, archiveId, archiveType} = this.props;

        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {

        let apiUrl = '/ModularityAgreementsArchiveAPI/?authToken='+authToken+'&archiveType='+archiveType;
        apiUrl += (archiveId) ? '&archiveId='+archiveId : '';
        apiUrl += (listArchive) ? '&listArchive='+listArchive : '';
        console.log(apiUrl);

        fetch(apiUrl)
            .then(res => res.json())
            .then( (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                    console.log(result.items);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.name}>
                            {item.name} {item.price}
                        </li>
                    ))}
                </ul>
            );
        }
    }
};