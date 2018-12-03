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
                        <th className="hidden-xs">{ModularityAgreementsArchiveObject.translation.supplier}</th>
                        <th className="hidden-xs">{ModularityAgreementsArchiveObject.translation.category}</th>
                        <th className="number hidden-xs">{ModularityAgreementsArchiveObject.translation.number}</th>
                        <th className="valid-from hidden-xs">{ModularityAgreementsArchiveObject.translation.fromdate}</th>
                        <th className="valid-to hidden-xs">{ModularityAgreementsArchiveObject.translation.todate}</th>
                        <th className="hidden-xs">{ModularityAgreementsArchiveObject.translation.contractsManager}</th>
                    </tr>
                    {paginatedItems.map((item, i) => (
                        (item.Supplier.Name) ?
                            <tr key={'row' + item.Id}>
                                <td key={'supplierName_' + item.Id}><span className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.supplier}: &nbsp;</span> <a
                                    data-id={item.Id}
                                    onClick={ (e) =>
                                        this.props.single(e, item.Id)
                                    }
                                    href="#"><b>{item.Supplier.Name}</b></a></td>
                                <td key={'category_' + item.Id}><span className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.category}: &nbsp;</span>{item.Category}</td>
                                <td key={'number_' + item.Id}><span className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.number}: &nbsp;</span>{item.Number}</td>
                                <td key={'validFrom_' + item.Id}><span className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.fromdate}: &nbsp;</span>{item.ValidFrom.replace('T00:00:00', '')}</td>
                                <td key={'validTo_' + item.Id}><span className="table-hover hidden-md hidden-lg">{ModularityAgreementsArchiveObject.translation.todate}: &nbsp;</span>{item.ValidTo.replace('T00:00:00', '')}</td>
                                <td key={'buyerName_' + item.Id}><span className="table-hover hidden-md hidden-lg hidden-sm">{ModularityAgreementsArchiveObject.translation.contractsManager}: &nbsp;</span>{item.Buyer.Name}</td>
                            </tr>
                            : ''
                    ))}
                    </tbody>
                </table>
            </div>);
    }
}

export default RenderTable;