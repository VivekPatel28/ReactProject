import React from "react";
import { AddSale } from "./AddSale";
import { SalesTable } from "./SalesTable";
import { EditSaleModal } from "./EditSale";
import toastr from "toastr";
import "toastr/build/toastr.css";

export class Sales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      products: [],
      stores: [],
      sales: [],
      loading: true,
      showEditModal: false,
      editSaleId: null,
      showDeleteModal: false,
      deleteSaleId: null,
    };
  }

  componentDidMount() {
    this.fetchCustomers();
    this.fetchSales();
    this.fetchProducts();
    this.fetchStores();
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

  fetchProducts = () => {
    fetch("api/Products")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ products: data, loading: false });
      });
  };

  fetchStores = () => {
    fetch("api/Stores")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ stores: data, loading: false });
      });
  };

  fetchSales = () => {
    fetch("api/Sales")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ sales: data, loading: false });
      });
  };

  handleAddSale = async (newSale) => {
    try {
      if (!newSale.customerId) {
        toastr.error("Please select a valid Customer", "", {
          positionClass: "toast-center",
        });
        return { status: "failure" };
      } else if (!newSale.productId) {
        toastr.error("Please select a valid Product", "", {
          positionClass: "toast-center",
        });
        return { status: "failure" };
      } else if (!newSale.storeId) {
        toastr.error("Please select a valid Store", "", {
          positionClass: "toast-center",
        });
        return { status: "failure" };
      } else if (newSale.dateSold === "") {
        toastr.error("Please select a valid date of sale", "", {
          positionClass: "toast-center",
        });
        return { status: "failure" };
      }
      const duplicateSale = this.state.sales.find(
        (sale) =>
          sale.customerId === newSale.customerId &&
          sale.productId === newSale.productId &&
          sale.storeId === newSale.storeId &&
          new Date(sale.dateSold).toLocaleDateString() ===
            new Date(newSale.dateSold).toLocaleDateString()
      );
      if (duplicateSale) {
        toastr.error("Duplicate Record, This sale record already exists.", "", {
          positionClass: "toast-center",
        });
        return { status: "failure" };
      } else {
        const response = await fetch("api/Sales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });

        if (response.ok) {
          const data = await response.json();
          const newId = data.id;
          const customerId = data.customerId;
          const productId = data.productId;
          const storeId = data.storeId;
          const newFinalSale = {
            ...newSale,
            customerId,
            productId,
            storeId,
            id: newId,
          };

          this.setState((prevState) => ({
            sales: [...prevState.sales, newFinalSale],
          }));
          toastr.success("The sale details were added successfully");
          return { status: "success" };
        } else {
          toastr.error("Failed to add sale details", "", {
            positionClass: "toast-center",
          });
          return { status: "failure" };
        }
      }
    } catch (error) {
      toastr.error(error.message);
      return { status: "failure" };
    }
  };

  handleDeleteSale = async (saleId) => {
    try {
      const response = await fetch(`api/Sales/${saleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.setState((prevState) => ({
          sales: prevState.sales.filter((sale) => sale.id !== saleId),
        }));
        this.handleCloseDelete();
        toastr.success("Sale was deleted successfully");
      } else {
        toastr.error("Failed to delete the sale details.", "", {
          positionClass: "toast-center",
        });
      }
    } catch (error) {
      toastr.error("Failed to delete the customer");
    }
  };

  handleShowDelete = (saleId) => {
    this.setState({ showDeleteModal: true, deleteSaleId: saleId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteSaleId: null });
  };

  handleEditSale = async (saleId, updatedSale) => {
    if (!updatedSale.customerId) {
      toastr.error("Please select a valid Customer Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (!updatedSale.productId) {
      toastr.error("Please select a valid Product Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (!updatedSale.storeId) {
      toastr.error("Please select a valid Store Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (updatedSale.dateSold === "") {
      toastr.error("Please enter a valid date of sale", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateSale = this.state.sales.find(
      (sale) =>
        sale.customerId === updatedSale.customerId &&
        sale.productId === updatedSale.productId &&
        sale.storeId === updatedSale.storeId &&
        new Date(sale.dateSold).toLocaleDateString() ===
          new Date(updatedSale.dateSold).toLocaleDateString()
    );
    const noChange = this.state.sales.find(
      (sale) =>
        sale.id === saleId &&
        sale.customerId === updatedSale.customerId &&
        sale.productId === updatedSale.productId &&
        sale.storeId === updatedSale.storeId &&
        new Date(sale.dateSold).toLocaleDateString() ===
          new Date(updatedSale.dateSold).toLocaleDateString()
    );
    if (noChange) {
      toastr.error(
        'No changes found, Please make the required changes and click "Save changes" or cancel the update',
        "",
        { positionClass: "toast-center" }
      );
    } else if (duplicateSale) {
      toastr.error(
        "Duplicate Record, Please check the sale details again",
        "",
        { positionClass: "toast-center" }
      );
    } else {
      try {
        const response = await fetch(`api/Sales/${saleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSale),
        });

        if (response.ok) {
          this.setState((prevState) => ({
            sales: prevState.sales.map((sale) =>
              sale.id === saleId ? updatedSale : sale
            ),
            showEditModal: false,
            editSaleId: null,
          }));
          toastr.success("Sale details were updated successfully");
        } else {
          toastr.error("Failed to update Sale details, Please try again", "", {
            positionClass: "toast-center",
          });
        }
      } catch (error) {
        toastr.error(error.message, "", { positionClass: "toast-center" });
      }
    }
  };

  handleOpenEditModal = (saleId) => {
    this.setState({ showEditModal: true, editSaleId: saleId });
    console.log(saleId);
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editSaleId: null });
  };

  render() {
    const {
      loading,
      customers,
      products,
      stores,
      sales,
      showEditModal,
      editSaleId,
      showDeleteModal,
      deleteSaleId,
    } = this.state;
    return (
      <div className="col-12 row">
        <div className="col-6">
          <h1>Sales</h1>
        </div>
        <div className="col-6 py-1 text-end">
          <AddSale
            customers={customers}
            products={products}
            stores={stores}
            handleAddSale={this.handleAddSale}
          />
        </div>

        {loading ? (
          <p>
            <em>Loading...</em>
          </p>
        ) : (
          <div className="container p-2">
            <div className="row pt-4">
              <div className="col-12">
                <SalesTable
                  customers={customers}
                  products={products}
                  stores={stores}
                  sales={sales}
                  showDeleteModal={showDeleteModal}
                  deleteSaleId={deleteSaleId}
                  handleShowDelete={this.handleShowDelete}
                  handleCloseDelete={this.handleCloseDelete}
                  onDeleteSale={this.handleDeleteSale}
                  onOpenEditModal={this.handleOpenEditModal}
                />
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <EditSaleModal
            customers={customers}
            products={products}
            stores={stores}
            saleId={editSaleId}
            sales={sales}
            onEditSale={this.handleEditSale}
            onCloseModal={this.handleCloseEditModal}
          />
        )}
      </div>
    );
  }
}
