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

    render() {
        const item = this.props.singleItems[0];
        return (
            <div id="singleView container-fluid">

                <div className="grid">
                    <div className="grid-md-2">
                        <button className="go-back btn btn-contrasted"
                                onClick={(e) =>
                                    this.props.tableView(e)
                                }><i className="pricon pricon-previous"></i>&nbsp;Back
                        </button>
                    </div>

                    <div className="grid-md-12">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">Grundinformation</h4>
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <td>Leverantör</td>
                                    <td>{item.Supplier.Name}</td>
                                </tr>
                                <tr>
                                    <td>Kategori</td>
                                    <td>{item.Category}</td>
                                </tr>
                                <tr>
                                    <td>Allmän information</td>
                                    <td>{item.Description}</td>
                                </tr>
                                <tr>
                                    <td>Giltlighetsperiod</td>
                                    <td>{item.ValidFrom.replace('T00:00:00', '')} - {item.ValidTo.replace('T00:00:00', '')}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid-md-6">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">Konstaktperson</h4>
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <td>Avtalsansvarig</td>
                                    <td>{item.Buyer.Name}</td>
                                </tr>
                                {(item.Buyer.OrganisationNumber) ?
                                    <tr>
                                        <td>Organisationsnr</td>
                                        <td>{item.Buyer.OrganisationNumber}</td>
                                    </tr>
                                    : ''
                                }
                                <tr>
                                    <td>Adress</td>
                                    <td>
                                        {(item.Buyer.Address.LineOne) ? item.Buyer.Address.LineOne : ''}
                                        {(item.Buyer.Address.LineOne) ? <br/> : ''}
                                        {(item.Buyer.Address.LineTwo) ? item.Buyer.Address.LineTwo : ''}
                                        {(item.Buyer.Address.LineTwo) ? <br/> : ''}
                                        {(item.Buyer.Address.ZipCode) ? item.Buyer.Address.ZipCode : ''} &nbsp;
                                        {(item.Buyer.Address.City) ? item.Buyer.Address.City : ''}
                                        {(item.Buyer.Address.City) ? <br/> : ''}
                                        {(item.Buyer.Address.Country) ? item.Buyer.Address.Country : ''}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Konstaktperson</td>
                                    <td>
                                        {item.Buyer.Contact.Name}
                                    </td>
                                </tr>
                                <tr>
                                    <td>E-post</td>
                                    <td>
                                        {item.Buyer.Contact.EmailAddress}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Telefon</td>
                                    <td>
                                        {item.Buyer.Contact.Telephone}
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid-md-6">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">Leverantör</h4>
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <td>Leverantör</td>
                                    <td>{item.Supplier.Name}</td>
                                </tr>
                                {(item.Supplier.OrganisationNumber) ?
                                    <tr>
                                        <td>Organisationsnr</td>
                                        <td key="supOrgnr">{item.Supplier.OrganisationNumber}</td>
                                    </tr>
                                    : ''
                                }
                                <tr>
                                    <td>Adress</td>
                                    <td key="supAddress">
                                        {(item.Supplier.Address.LineOne) ? item.Supplier.Address.LineOne : ''}
                                        {(item.Supplier.Address.LineOne) ? <br/> : ''}
                                        {(item.Supplier.Address.LineTwo) ? item.Supplier.Address.LineTwo : ''}
                                        {(item.Supplier.Address.LineTwo) ? <br/> : ''}
                                        {(item.Supplier.Address.ZipCode) ? item.Supplier.Address.ZipCode : ''} &nbsp;
                                        {(item.Supplier.Address.City) ? item.Supplier.Address.City : ''}
                                        {(item.Supplier.Address.City) ? <br/> : ''}
                                        {(item.Supplier.Address.Country) ? item.Supplier.Address.Country : ''}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Konstaktperson</td>
                                    <td key="supContactperson">
                                        {item.Supplier.Contact.Name}
                                    </td>
                                </tr>
                                <tr>
                                    <td>E-post</td>
                                    <td key="supEmail">
                                        {item.Supplier.Contact.EmailAddress}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Telefon</td>
                                    <td key="supTelephone">
                                        {item.Supplier.Contact.Telephone}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {(item.Documents.length) ?
                    <div className="grid-md-12">
                        <div className="box box-panel box-panel-secondary">
                            <h4 className="box-title">Dokuments</h4>
                            <table className="table table-striped">
                                {item.Documents.map((doc, index) => (
                                    <tr>
                                        <td>
                                            <a onClick={(e) =>
                                                this.downLoad(e, doc[index].Url)
                                            } href="#">{doc[index].Name}
                                            </a>
                                        </td>
                                        <td>{doc[index].Size}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                    : '' }
                </div>
            </div>
        );
    }
}

export default Single;