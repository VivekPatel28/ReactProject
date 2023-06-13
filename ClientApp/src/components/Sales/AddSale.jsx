import React from "react";

export class AddSale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    const dateSold = e.target.elements.saleDate.value;
    const customerId = parseInt(
      e.target.elements.customerName.value.trim(),
      10
    );
    const productId = parseInt(e.target.elements.productName.value.trim(), 10);
    const storeId = parseInt(e.target.elements.storeName.value.trim(), 10);

    try {
      const resp = await this.props.handleAddSale({
        dateSold: dateSold,
        customerId: customerId,
        productId: productId,
        storeId: storeId,
      });

      if (resp.status === "success") {
        document.querySelector(".contact-form").reset();
        this.handleClose();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const { show } = this.state;
    const { customers, products, stores } = this.props;
    return (
      <div className="col-12 text-white p-2">
        <button className="btn border-black btnGray" onClick={this.handleShow}>
          Create New Sale
        </button>
        {show && (
          <div onClick={this.handleClose} className="overlay">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="modalContainer"
            >
              <div className="col-12">
                <div className="col-12 row">
                  <h2 className="col-8 text-center text-black pt-3">
                    Create a new Sale
                  </h2>
                  <div className="col-4 text-end p-3">
                    <button
                      className="btn border-black btnGray btn-sm m-1"
                      onClick={this.handleClose}
                    >
                      X
                    </button>
                  </div>
                </div>
                <form onSubmit={this.handleFormSubmit} className="contact-form">
                  <input hidden name="saleId"></input>
                  {/* Customer dropdown */}
                  <div className="col-6 col-md-8 p-3">
                    <select
                      className="form-control form-control-sm"
                      name="customerName"
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Product dropdown */}
                  <div className="col-6 col-md-8 p-3">
                    <select
                      className="form-control form-control-sm"
                      name="productName"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Store dropdown */}
                  <div className="col-6 col-md-8 p-3">
                    <select
                      className="form-control form-control-sm"
                      name="storeName"
                    >
                      <option value="">Select Store</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Sale date */}
                  <div className="col-6 col-md-8 p-3">
                    <input
                      className="form-control form-control-sm"
                      type="date"
                      name="saleDate"
                    ></input>
                  </div>
                  <div className="col-6 p-3">
                    <button className="btn border-black btnGray form-control">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
