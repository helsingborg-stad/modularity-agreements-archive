//const RenderTable = ({paginatedItems}) =>

class RenderTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const paginatedItems = this.props.paginatedItems;
        return (

            <div className="box box-panel box-panel-secondary">
                <h4 className="box-title"></h4>
                <table className="table table-striped" items={paginatedItems}>
                    <tbody>
                    <tr>
                        <th className="hidden-xs hidden-sm">{ModularityAgreementsArchiveObject.translation.supplier}</th>
                        <th className="hidden-xs hidden-sm">{ModularityAgreementsArchiveObject.translation.category}</th>
                        <th className="hidden-xs hidden-sm">{ModularityAgreementsArchiveObject.translation.contractsManager}</th>
                        <th className="hidden-xs hidden-sm">{ModularityAgreementsArchiveObject.translation.todate}</th>
                    </tr>
                    {(!this.props.isLoaded) ?
                        <tr>
                            <td colSpan="6">
                                <div className="gutter">
                                    <div className="loading">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </td>
                        </tr> : null}
                    {(this.props.isLoaded) ?
                    paginatedItems.map((item, i) => (
                        (item.Supplier.Name) ?
                            <tr key={'row' + item.Id}>
                                <td key={'supplierName_' + item.Id}><span
                                    className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.supplier}: &nbsp;</span>
                                    <a
                                        data-id={item.Id}
                                        onClick={(e) =>
                                            this.props.single(e, item.Id)
                                        }
                                        href="#"><b>{item.Supplier.Name}</b></a></td>
                                <td key={'category_' + item.Id}><span
                                    className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.category}: &nbsp;</span>{item.Name}
                                </td>

                                <td key={'buyerName_' + item.Id}><span
                                    className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.contractsManager}: &nbsp;</span>{item.Buyer.Name}
                                </td>
                                <td key={'todDate_' + item.Id}><span
                                    className="table-hover hidden-md hidden-lg hidden-sm valid-to">{ModularityAgreementsArchiveObject.translation.todate}: &nbsp;</span>{item.ValidTo.replace('T00:00:00','')}
                                </td>
                            </tr>
                            : null
                    )) : null}
                    </tbody>
                </table>
            </div>);
    }
}

export default RenderTable;