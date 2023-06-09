import React from "react";
import { AddCustomer } from "./AddCustomer";
import { CustomersTable } from "./CustomersTable";
import { EditCustomerModal } from "./EditCustomer";

export class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      loading: true,
      showEditModal: false,
      editCustomerId: null,
      showDeleteModal: false,
      deleteCustomerId: null,
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    fetch("api/Customers")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ customers: data, loading: false });
      });
  };

  handleAddCustomer = (newCustomer) => {
    if (newCustomer.name === "") {
      return { status: "failure", msg: "Please Enter a valid Name" };
    } else if (newCustomer.address === "") {
      return { status: "failure", msg: "Please Enter a valid Address" };
    }

    const duplicateCustomer = this.state.customers.find(
      (customer) =>
        customer.name.trim() === newCustomer.name &&
        customer.address.trim() === newCustomer.address
    );
    if (duplicateCustomer) {
      return { status: "failure", msg: "Duplicate Record" };
    } else {
      fetch("api/Customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      })
        .then((response) => response.json())
        .then((data) => {
          const newId = data.id;
          const newFinalCustomer = {
            ...newCustomer,
            id: newId,
          };
          this.setState((prevState) => ({
            customers: [...prevState.customers, newFinalCustomer],
          }));
        })
        .catch((error) => {
          return { status: "failure", msg: error.message };
        });
      return {
        status: "success",
        msg: "Customer was added successfully",
      };
    }
  };

  handleDeleteCustomer = (customerId) => {
    fetch(`api/Customers/${customerId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          this.setState((prevState) => ({
            customers: prevState.customers.filter(
              (customer) => customer.id !== customerId
            ),
          }));
          this.handleCloseDelete();
        } else {
          throw new Error("Failed to delete customer");
        }
      })
      .catch((error) => {
        return { status: "failure", msg: error.message };
      });
    return {
      status: "success",
      msg: "Customer was deleted successfully",
    };
  };

  handleShowDelete = (customerId) => {
    this.setState({ showDeleteModal: true, deleteCustomerId: customerId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteCustomerId: null });
  };

  handleEditCustomer = (customerId, updatedCustomer) => {
    fetch(`api/Customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCustomer),
    })
      .then((response) => {
        if (response.ok) {
          this.setState((prevState) => ({
            customers: prevState.customers.map((customer) =>
              customer.id === customerId ? updatedCustomer : customer
            ),
            showEditModal: false,
            editCustomerId: null,
          }));
          return {
            status: "success",
            msg: "Customer was updated successfully",
          };
        } else {
          throw new Error("Failed to update customer");
        }
      })
      .catch((error) => {
        return { status: "failure", msg: error.message };
      });
  };

  handleOpenEditModal = (customerId) => {
    this.setState({ showEditModal: true, editCustomerId: customerId });
    console.log(customerId);
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editCustomerId: null });
  };

  render() {
    const {
      loading,
      customers,
      showEditModal,
      editCustomerId,
      showDeleteModal,
      deleteCustomerId,
    } = this.state;
    return (
      <div className="col-12 row">
        <div className="col-6">
          <h1>Customers</h1>
        </div>
        <div className="col-6 py-1 text-end">
          <AddCustomer handleAddCustomer={this.handleAddCustomer} />
        </div>

        {loading ? (
          <p>
            <em>Loading...</em>
          </p>
        ) : (
          <div className="container p-2">
            <div className="row pt-4">
              <div className="col-12">
                <CustomersTable
                  customers={customers}
                  showDeleteModal={showDeleteModal}
                  deleteCustomerId={deleteCustomerId}
                  handleShowDelete={this.handleShowDelete}
                  handleCloseDelete={this.handleCloseDelete}
                  onDeleteCustomer={this.handleDeleteCustomer}
                  onOpenEditModal={this.handleOpenEditModal}
                />
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <EditCustomerModal
            customerId={editCustomerId}
            customers={customers}
            onEditCustomer={this.handleEditCustomer}
            onCloseModal={this.handleCloseEditModal}
          />
        )}
      </div>
    );
  }
}
