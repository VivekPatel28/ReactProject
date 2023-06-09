﻿import React from "react";

export class CustomersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      successMessage: undefined,
    };
  }

  clearErrorMessages = () => {
    this.setState({
      errorMessage: undefined,
      successMessage: undefined
    });
  };

  deleteCustomer = () => {
    const resp = this.props.onDeleteCustomer(this.props.deleteCustomerId);

    if (resp.status === "success") {
      this.setState({ errorMessage: undefined, successMessage: resp.msg });
      setTimeout(this.clearErrorMessages, 5000);
    } else {
      this.setState({ errorMessage: resp.msg, successMessage: undefined });
      setTimeout(this.clearErrorMessages, 5000);
    }
  };
  
  render() {
    const {
      customers,
      onOpenEditModal,
      showDeleteModal,
      handleShowDelete,
      handleCloseDelete,
      deleteCustomerId,
    } = this.props;
    return (
      <div className="col-12">
      <div className="row">
      <div className="col-6"></div>
        {this.state.successMessage === undefined ? (
          <div></div>
        ) : (
          <div className="col-6 text-bg-danger text-center p-2">
            {this.state.successMessage}
          </div>
        )}
        {this.state.errorMessage === undefined ? (
          <div></div>
        ) : (
          <div className="col-6 text-center text-danger">
            {this.state.errorMessage}
          </div>
        )}
        </div>
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
                      onClick={this.deleteCustomer}
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
