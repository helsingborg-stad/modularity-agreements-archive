//const RenderTable = ({paginatedItems}) =>
class RenderTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const paginatedItems = this.props.paginatedItems;
        return (
            <div className="box box-panel box-panel-secondary">
                <h4 className="box-title">{ModularityAgreementsArchiveObject.translation.title}</h4>
                <table className="table table-striped" items={paginatedItems}>
                    <tbody>
                    <tr>
                        <th>{ModularityAgreementsArchiveObject.translation.supplier}</th>
                        <th>{ModularityAgreementsArchiveObject.translation.category}</th>
                        <th className="number hidden-xs">{ModularityAgreementsArchiveObject.translation.number}</th>
                        <th className="valid-from hidden-xs">{ModularityAgreementsArchiveObject.translation.fromdate}</th>
                        <th className="valid-to hidden-xs">{ModularityAgreementsArchiveObject.translation.todate}</th>
                        <th className="hidden-xs">{ModularityAgreementsArchiveObject.translation.buyername}</th>
                    </tr>
                    {paginatedItems.map((item, i) => (
                        (item.Supplier.Name) ?
                            <tr key={'row' + item.Id}>
                                <td key={'supplierName_' + item.Id}><a
                                    data-id={item.Id}
                                    onClick={ (e) =>
                                        this.props.single(e, item.Id)
                                    }
                                    href="#">{item.Supplier.Name}</a></td>
                                <td key={'category_' + item.Id}>{item.Category}</td>
                                <td className="hidden-xs" key={'number_' + item.Id}>{item.Number}</td>
                                <td className="hidden-xs"
                                    key={'validFrom_' + item.Id}>{item.ValidFrom.replace('T00:00:00', '')}</td>
                                <td className="hidden-xs"
                                    key={'validTo_' + item.Id}>{item.ValidTo.replace('T00:00:00', '')}</td>
                                <td className="hidden-xs" key={'buyerName_' + item.Id}>{item.Buyer.Name}</td>
                            </tr>
                            : ''
                    ))}
                    </tbody>
                </table>
            </div>);
    }
}

export default RenderTable;