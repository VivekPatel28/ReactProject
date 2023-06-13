import React from "react";

export class CustomersTable extends React.Component {
  render() {
    const {
      customers,
      onOpenEditModal,
      showDeleteModal,
      handleShowDelete,
      handleCloseDelete,
      deleteCustomerId,
      onDeleteCustomer,
    } = this.props;
    return (
      <div className="col-12">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th hidden={true}>Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="dataText">{customer.name}</td>
                <td className="dataText">{customer.address}</td>
                <td>
                  <div className="col-2 col-md-6">
                    <button
                      className="btn btn-outline-dark btn-sm m-1"
                      onClick={() => onOpenEditModal(customer.id)}
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
                  <div className="col-2 col-md-6 ">
                    <button
                      className="btn border-black btnGray btn-sm m-1"
                      onClick={() => handleShowDelete(customer.id)}
                    >
                      <i
                        className="bi bi-trash-fill"
                        style={{ fontSize: "1rem" }}
                      ></i>{" "}
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteModal && deleteCustomerId && (
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
                    Are you sure you want to Delete this customer?
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
                      onClick={() => onDeleteCustomer(deleteCustomerId)}
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
