import React from "react";
import { AddProduct } from "./AddProduct";
import { ProductsTable } from "./ProductsTable";
import { EditProductModal } from "./EditProduct";
import toastr from "toastr";
import "toastr/build/toastr.css";

export class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sales:[],
      loading: true,
      showEditModal: false,
      editProductId: null,
      showDeleteModal: false,
      deleteProductId: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
    this.fetchSales();
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

  fetchProducts = () => {
    fetch("api/Products")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ products: data, loading: false });
      });
  };

  fetchSales = () => {
    fetch("api/Sales")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ sales: data, loading: false });
      });
  };

  handleAddProduct = async (newProduct) => {
    if (newProduct.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (newProduct.price === "") {
      toastr.error("Please enter appropiate price", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateProduct = this.state.products.find(
      (product) => product.name.trim() === newProduct.name
    );
    if (duplicateProduct) {
      toastr.error(
        "Duplicate Record, Please check the product details again",
        "",
        { positionClass: "toast-center" }
      );
      return { status: "failure" };
    } else {
      try {
        const response = await fetch("api/Products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error("Failed to add product");
        }

        const data = await response.json();
        const newId = data.id;
        const newFinalProduct = {
          ...newProduct,
          id: newId,
        };
        this.setState((prevState) => ({
          products: [...prevState.products, newFinalProduct],
        }));
        toastr.success("Product was added successfully");
        return { status: "success" };
      } catch (error) {
        toastr.error(error.message);
        return { status: "failure" };
      }
    }
  };

  handleDeleteProduct = async (productId) => {
    const dataExist = this.state.sales.find(
      (sales) => 
      sales.productId === productId
    )
    if (dataExist) {
      toastr.error(
        "Failed to delete this product. The product may have existing sale records.",
        "",
        { positionClass: "toast-center" }
      );
      this.handleCloseDelete();
      return {};
    }
    try {
      const response = await fetch(`api/Products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.setState((prevState) => ({
          products: prevState.products.filter(
            (product) => product.id !== productId
          ),
        }));
        this.handleCloseDelete();
        toastr.success("Product was deleted successfully");
      }
    } catch (error) {
      toastr.error("Failed to delete the product, Please try again.");
    }
  };

  handleShowDelete = (productId) => {
    this.setState({ showDeleteModal: true, deleteProductId: productId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteProductId: null });
  };

  handleEditProduct = async (productId, updatedProduct) => {
    if (updatedProduct.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (updatedProduct.price === "") {
      toastr.error("Please enter appropiate price", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateProduct = this.state.products.find(
      (product) => product.name.trim() === updatedProduct.name.trim()
    );
    const noChange = this.state.products.find(
      (product) =>
        product.id === productId &&
        product.name.trim() === updatedProduct.name &&
        product.price === updatedProduct.price
    );
    if (noChange) {
      toastr.error(
        'No changes found, Please make the required changes and click "Save changes" or cancel the update',
        "",
        { positionClass: "toast-center" }
      );
    } else if (duplicateProduct) {
      toastr.error(
        "Duplicate Record, Please check the product details again",
        "",
        { positionClass: "toast-center" }
      );
      return { status: "failure" };
    } else {
      try {
        const response = await fetch(`api/Products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          this.setState((prevState) => ({
            products: prevState.products.map((product) =>
              product.id === productId ? updatedProduct : product
            ),
            showEditModal: false,
            editProductId: null,
          }));
          toastr.success("Product was updated successfully");
        } else {
          toastr.error("Failed to update product, Please try again", "", {
            positionClass: "toast-center",
          });
        }
      } catch (error) {
        toastr.error(error.message, "", { positionClass: "toast-center" });
      }
    }
  };

  handleOpenEditModal = (productId) => {
    this.setState({ showEditModal: true, editProductId: productId });
    console.log(productId);
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editProductId: null });
  };

  render() {
    const {
      loading,
      products,
      showEditModal,
      editProductId,
      showDeleteModal,
      deleteProductId,
    } = this.state;
    return (
      <div className="col-12 row">
        <div className="col-6">
          <h1>Products</h1>
        </div>
        <div className="col-6 py-1 text-end">
          <AddProduct handleAddProduct={this.handleAddProduct} />
        </div>

        {loading ? (
          <p>
            <em>Loading...</em>
          </p>
        ) : (
          <div className="container p-2">
            <div className="row pt-4">
              <div className="col-12">
                <ProductsTable
                  products={products}
                  showDeleteModal={showDeleteModal}
                  deleteProductId={deleteProductId}
                  handleShowDelete={this.handleShowDelete}
                  handleCloseDelete={this.handleCloseDelete}
                  onDeleteProduct={this.handleDeleteProduct}
                  onOpenEditModal={this.handleOpenEditModal}
                />
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <EditProductModal
            productId={editProductId}
            products={products}
            onEditProduct={this.handleEditProduct}
            onCloseModal={this.handleCloseEditModal}
          />
        )}
      </div>
    );
  }
}
