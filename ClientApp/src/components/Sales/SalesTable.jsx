import React from "react";

export class SalesTable extends React.Component {
  getCustomerName(customerId) {
    const { customers } = this.props;
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "";
  }

  getProductName(productId) {
    const { products } = this.props;
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "";
  }

  getStoreName(storeId) {
    const { stores } = this.props;
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : "";
  }

  render() {
    const {
      sales,
      onOpenEditModal,
      showDeleteModal,
      handleShowDelete,
      handleCloseDelete,
      deleteSaleId,
      onDeleteSale,
    } = this.props;

    return (
      <div className="col-12">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th hidden={true}>Id</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Store</th>
              <th>Date Sold</th>
              <th>Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <React.Fragment key={sale.id}>
                <tr>
                  <td className="dataText">
                    {this.getCustomerName(sale.customerId)}
                  </td>
                  <td className="dataText">
                    {this.getProductName(sale.productId)}
                  </td>
                  <td className="dataText">
                    {this.getStoreName(sale.storeId)}
                  </td>
                  <td className="dataText">
                    {new Date(sale.dateSold).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="col-2 col-md-10">
                      <button
                        className="btn btn-outline-dark btn-sm m-1"
                        onClick={() => onOpenEditModal(sale.id)}
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ fontSize: "1rem" }}
                        ></i>{" "}
                        Edit
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="col-2 col-md-10 ">
                      <button
                        className="btn border-black btnGray btn-sm m-1"
                        onClick={() => handleShowDelete(sale.id)}
                      >
                        <i
                          className="bi bi-trash-fill"
                          style={{ fontSize: "1rem" }}
                        ></i>{" "}
                        Delete
                      </button>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {showDeleteModal && deleteSaleId && (
          <div onClick={() => handleCloseDelete()} className="overlay">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="modalContainer"
            >
              <div className="col-12">
                <div className="row ">
                  <h3 className="col-8 text-center text-black py-5">
                    Are you sure you want to Delete this Sale?
                  </h3>
                  <div className="col-4 text-end p-3">
                    <button
                      className="btn border-black btnGray btn-sm m-1"
                      onClick={() => handleCloseDelete()}
                    >
                      X
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 p-3">
                    <button
                      className="btn btn-secondary form-control"
                      onClick={() => handleCloseDelete()}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-6 p-3">
                    <button
                      className="btn btnGray border-black form-control"
                      onClick={() => onDeleteSale(deleteSaleId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
