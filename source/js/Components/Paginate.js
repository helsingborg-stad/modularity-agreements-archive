import {Pagination} from 'hbg-react';

class Paginate extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const showSearch = this.props.showSearch;
        const css = (showSearch) ? 'grid-md-6 ' : 'grid-md-12';
        return (

            <div className={css}>
                <div className="gutter grid">
                    <div className="grid-fit-content u-ml-auto">
                        <Pagination
                            className="pagination"
                            current={this.props.current}
                            total={this.props.total}
                            next={this.props.next}
                            prev={this.props.prev}
                            input={this.props.input}
                            langPrev={ModularityAgreementsArchiveObject.translation.previous}
                            langNext={ModularityAgreementsArchiveObject.translation.next}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default Paginate;