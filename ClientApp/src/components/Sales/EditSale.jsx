import React from "react";

export class EditSaleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSold: "",
      customerId: undefined,
      productId: undefined,
      storeId: undefined,
    };
  }

  refreshPage() {
    window.location.reload();
  }

  componentDidMount() {
    const { saleId, sales } = this.props;
    const sale = sales.find((c) => c.id === saleId);
    if (sale) {
      const formattedDate = sale.dateSold.substring(0, 10);
      this.setState({
        dateSold: formattedDate,
        customerId: sale.customerId,
        productId: sale.productId,
        storeId: sale.storeId,
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = async () => {
    const { saleId, onEditSale } = this.props;
    const { dateSold, customerId, productId, storeId } = this.state;
    const updatedSale = {
      id: saleId,
      dateSold: dateSold,
      customerId: parseInt(customerId, 10),
      productId: parseInt(productId, 10),
      storeId: parseInt(storeId, 10),
    };
    await onEditSale(saleId, updatedSale);
  };

  render() {
    const { onCloseModal, customers, products, stores } = this.props;
    const { dateSold, customerId, productId, storeId } = this.state;
    return (
      <div
        onClick={onCloseModal}
        className="overlay"
        tabIndex="-1"
        role="dialog"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="modalContainer"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Sale</h5>
              <button
                type="button"
                className="btn border-black btnGray btn-sm m-1"
                onClick={onCloseModal}
              >
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Customer</label>
                <select
                  className="form-control"
                  name="customerId"
                  value={customerId}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Product</label>
                <select
                  className="form-control"
                  name="productId"
                  value={productId}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Store</label>
                <select
                  className="form-control"
                  name="storeId"
                  value={storeId}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Sold</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateSold"
                  value={dateSold}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btnGray border-black"
                onClick={this.handleSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
