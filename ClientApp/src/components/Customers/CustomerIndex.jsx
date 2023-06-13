import React from "react";
import { AddCustomer } from "./AddCustomer";
import { CustomersTable } from "./CustomersTable";
import { EditCustomerModal } from "./EditCustomer";
import toastr from "toastr";
import "toastr/build/toastr.css";

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
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 5000,
      extendedTimeOut: 1000,
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  }

  fetchCustomers = () => {
    fetch("api/Customers")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ customers: data, loading: false });
      });
  };

  handleAddCustomer = async (newCustomer) => {
    if (newCustomer.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (newCustomer.address === "") {
      toastr.error("Please enter a valid Address", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateCustomer = this.state.customers.find(
      (customer) =>
        customer.name.trim() === newCustomer.name &&
        customer.address.trim() === newCustomer.address
    );
    if (duplicateCustomer) {
      toastr.error(
        "Duplicate Record, Please check the customer details again",
        "",
        { positionClass: "toast-center" }
      );
      return { status: "failure" };
    } else {
      try {
        const response = await fetch("api/Customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        });

        if (response.ok) {
          const data = await response.json();
          const newId = data.id;
          const newFinalCustomer = {
            ...newCustomer,
            id: newId,
          };

          this.setState((prevState) => ({
            customers: [...prevState.customers, newFinalCustomer],
          }));
          toastr.success("Customer was added successfully");
          return { status: "success" };
        } else {
          toastr.error("Failed to add customer", "", {
            positionClass: "toast-center",
          });
          return { status: "failure" };
        }
      } catch (error) {
        toastr.error(error.message);
        return { status: "failure" };
      }
    }
  };

  handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`api/Customers/${customerId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        this.setState((prevState) => ({
          customers: prevState.customers.filter(
            (customer) => customer.id !== customerId
          ),
        }));
        this.handleCloseDelete();
        toastr.success("Customer was deleted successfully");
      } else if (response.status === 500) {
        toastr.error(
          "Failed to delete this customer. The customer may have existing sale records.",
          "",
          { positionClass: "toast-center" }
        );
      } else {
        toastr.error("Failed to delete the customer");
      }
    } catch (error) {
      toastr.error("Failed to delete the customer");
    }
  };
  
  handleShowDelete = (customerId) => {
    this.setState({ showDeleteModal: true, deleteCustomerId: customerId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteCustomerId: null });
  };

  handleEditCustomer = async (customerId, updatedCustomer) => {
    if (updatedCustomer.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (updatedCustomer.address === "") {
      toastr.error("Please enter a valid Address", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateCustomer = this.state.customers.find(
      (customer) =>
        customer.name.trim() === updatedCustomer.name.trim() &&
        customer.address.trim() === updatedCustomer.address.trim()
    );
    const noChange = this.state.customers.find(
      (customer) =>
        customer.id === customerId &&
        customer.name.trim() === updatedCustomer.name &&
        customer.address.trim() === updatedCustomer.address
    );
    if (noChange) {
      toastr.error(
        'No changes found, Please make the required changes and click "Save changes" or cancel the update',
        "",
        { positionClass: "toast-center" }
      );
    } else if (duplicateCustomer) {
      toastr.error(
        "Duplicate Record, Please check the customer details again",
        "",
        { positionClass: "toast-center" }
      );
    } else {
      try {
        const response = await fetch(`api/Customers/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomer),
        });

        if (response.ok) {
          this.setState((prevState) => ({
            customers: prevState.customers.map((customer) =>
              customer.id === customerId ? updatedCustomer : customer
            ),
            showEditModal: false,
            editCustomerId: null,
          }));
          toastr.success("Customer was updated successfully");
        } else {
          toastr.error("Failed to update customer, Please try again", "", {
            positionClass: "toast-center",
          });
        }
      } catch (error) {
        toastr.error(error.message, "", { positionClass: "toast-center" });
      }
    }
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
        {showEditModal && (
          <EditCustomerModal
            customerId={editCustomerId}
            customers={customers}
            onEditCustomer={this.handleEditCustomer}
            onCloseModal={this.handleCloseEditModal}
          />
        )}

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
      </div>
    );
  }
}
