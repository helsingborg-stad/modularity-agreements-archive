import axios from 'axios';

class Single extends React.Component {
    constructor(props) {
        super(props);
    }

    downLoad(e, datafileUrl) {
        e.preventDefault();

        axios
        ({
            url: datafileUrl,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            let blob = new Blob([response.data]);
            if (typeof window.navigator.msSaveBlob !== 'undefined') {

                window.navigator.msSaveBlob(blob, datafileUrl);
            } else {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.pdf');
                document.body.appendChild(link);
                link.click();
            }
        });
    }

    createMarkup(html) {
        escapeEl.textContent = html;
        return escapeEl.innerHTML;
    };

    render() {
        const item = this.props.singleItems[0];
        return (
            <div id="singleView" className="container-fluid">
                <div className="grid">
                    <div className="grid-md-2">
                        <button
                            className="go-back btn validated valid hf-in-range hf-user-valid"
                            aria-invalid="false"
                            onClick={(e) =>
                                this.props.tableView(e)
                            }>
                            <i className="pricon pricon-back"></i> {ModularityAgreementsArchiveObject.translation.back}
                        </button>
                    </div>

                    <div className="grid-md-12">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">{ModularityAgreementsArchiveObject.translation.generalInfo}</h4>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.supplier}</td>
                                    <td>{item.Supplier.Name}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.category}</td>
                                    <td>{item.Category}</td>
                                </tr>
                                <tr>
                                    <td className="align-top title">{ModularityAgreementsArchiveObject.translation.details}</td>
                                    <td dangerouslySetInnerHTML={{__html: item.Description}} />
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.periodOfValid}</td>
                                    <td>{item.ValidFrom.replace('T00:00:00', '') + ' - ' + item.ValidTo.replace('T00:00:00', '')}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid-md-6">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">{ModularityAgreementsArchiveObject.translation.contactPerson}</h4>
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.contractsManager}</td>
                                    <td>{item.Buyer.Name}</td>
                                </tr>
                                {(item.Buyer.OrganisationNumber) ?
                                    <tr>
                                        <td className="title">{ModularityAgreementsArchiveObject.translation.organizationnumber}</td>
                                        <td>{item.Buyer.OrganisationNumber}</td>
                                    </tr> : null}
                                <tr>
                                    <td className="title align-top">{ModularityAgreementsArchiveObject.translation.address}</td>
                                    <td>{(item.Buyer.Address.LineOne) ? item.Buyer.Address.LineOne : null}
                                        {(item.Buyer.Address.LineOne) ? <br/> : null}
                                        {(item.Buyer.Address.LineTwo) ? item.Buyer.Address.LineTwo : null}
                                        {(item.Buyer.Address.LineTwo) ? <br/> : null}
                                        {(item.Buyer.Address.ZipCode) ? item.Buyer.Address.ZipCode : null} &nbsp;
                                        {(item.Buyer.Address.City) ? item.Buyer.Address.City : null}
                                        {(item.Buyer.Address.City) ? <br/> : null}
                                        {(item.Buyer.Address.Country) ? item.Buyer.Address.Country : null}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.contactPerson}</td>
                                    <td>{item.Buyer.Contact.Name}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.email}</td>
                                    <td>{item.Buyer.Contact.EmailAddress}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.phone}</td>
                                    <td>{item.Buyer.Contact.Telephone}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid-md-6">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">{ModularityAgreementsArchiveObject.translation.supplier}</h4>
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.supplier}</td>
                                    <td>{item.Supplier.Name}</td>
                                </tr>
                                {(item.Supplier.OrganisationNumber) ?
                                    <tr>
                                        <td className="title">{ModularityAgreementsArchiveObject.translation.organizationnumber}</td>
                                        <td key="supOrgnr">{item.Supplier.OrganisationNumber}</td>
                                    </tr>
                                    : null
                                }
                                <tr>
                                    <td className="title align-top">{ModularityAgreementsArchiveObject.translation.address}</td>
                                    <td key="supAddress">{(item.Supplier.Address.LineOne) ? item.Supplier.Address.LineOne : null}
                                        {(item.Supplier.Address.LineOne) ? <br/> : null}
                                        {(item.Supplier.Address.LineTwo) ? item.Supplier.Address.LineTwo : null}
                                        {(item.Supplier.Address.LineTwo) ? <br/> : null}
                                        {(item.Supplier.Address.ZipCode) ? item.Supplier.Address.ZipCode : null} &nbsp;
                                        {(item.Supplier.Address.City) ? item.Supplier.Address.City : null}
                                        {(item.Supplier.Address.City) ? <br/> : null}
                                        {(item.Supplier.Address.Country) ? item.Supplier.Address.Country : null}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.contactPerson}</td>
                                    <td key="supContactperson">{item.Supplier.Contact.Name}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.email}</td>
                                    <td key="supEmail">{item.Supplier.Contact.EmailAddress}</td>
                                </tr>
                                <tr>
                                    <td className="title">{ModularityAgreementsArchiveObject.translation.phone}</td>
                                    <td key="supTelephone">{item.Supplier.Contact.Telephone}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {(item.Documents.length) ?
                        <div className="grid-md-12">
                            <div className="box box-panel box-panel-secondary">
                                <h4 className="box-title">{ModularityAgreementsArchiveObject.translation.documents}</h4>
                                <table className="table table-striped">
                                    <tbody>
                                    <tr>
                                        <td>{ModularityAgreementsArchiveObject.translation.file}</td>
                                        <td>ModularityAgreementsArchiveObject.translation.fileSize}</td>
                                    </tr>
                                    {item.Documents.map((doc, index) => (
                                        <tr key={'tr_doc_' + index}>
                                            <td key={'file_doc_' + index}>
                                                <a key={'a_doc_' + index} onClick={(e) =>
                                                    this.downLoad(e, doc.Url)
                                                } href="#">{doc.Name}</a>
                                            </td>
                                            <td key={'size_doc_' + index}>{doc.Size}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}

export default Single;
