import React from "react";
import { AddSale } from "./AddSale";
import { SalesTable } from "./SalesTable";
import { EditSaleModal } from "./EditSale";

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
      if (newSale.customerId === "") {
        return { status: "failure", msg: "Please select a valid Customer" };
      } else if (newSale.productId === "") {
        return { status: "failure", msg: "Please select a valid Product" };
      } else if (newSale.storeId === "") {
        return { status: "failure", msg: "Please select a valid Store" };
      } else if (newSale.dateSold === "") {
        return { status: "failure", msg: "Please enter a valid date of sale" };
      }
      const duplicateSale = this.state.sales.find(
        (sale) =>
          sale.customerId === newSale.customerId &&
          sale.productId === newSale.productId &&
          sale.storeId === newSale.storeId
      );
      if (duplicateSale) {
        return {
          status: "failure",
          msg: "This sale record already exists.",
        };
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

          return {
            status: "success",
            msg: "Sale was added successfully",
          };
        } else {
          throw new Error("Failed to add sale");
        }
      }
    } catch (error) {
      return { status: "failure", msg: error.message };
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

        return {
          status: "success",
          msg: "Sale was deleted successfully",
        };
      } else {
        throw new Error("Failed to delete Sale");
      }
    } catch (error) {
      return {
        status: "failure",
        msg: error.message,
      };
    }
  };

  handleShowDelete = (saleId) => {
    this.setState({ showDeleteModal: true, deleteSaleId: saleId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteSaleId: null });
  };

  handleEditSale = async (saleId, updatedSale) => {
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
  
        return {
          status: "success",
          msg: "Sale was updated successfully",
        };
      } else {
        throw new Error("Failed to update Sale");
      }
    } catch (error) {
      return {
        status: "failure",
        msg: error.message,
      };
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
