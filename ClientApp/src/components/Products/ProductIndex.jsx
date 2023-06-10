import React from "react";
import { AddProduct } from "./AddProduct";
import { ProductsTable } from "./ProductsTable";
import { EditProductModal } from "./EditProduct";

export class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      showEditModal: false,
      editProductId: null,
      showDeleteModal: false,
      deleteProductId: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    fetch("api/Products")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ products: data, loading: false });
      });
  };

  handleAddProduct = async (newProduct) => {
    if (newProduct.name === "") {
      return { status: "failure", msg: "Please enter a valid Product Name" };
    } else if (newProduct.price === "") {
      return { status: "failure", msg: "Please enter a valid Price" };
    }
  
    const duplicateProduct = this.state.products.find(
      (product) => product.name.trim() === newProduct.name
    );
    if (duplicateProduct) {
      return { status: "failure", msg: "Duplicate Record" };
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
  
        return {
          status: "success",
          msg: "Product was added successfully",
        };
      } catch (error) {
        return { status: "failure", msg: error.message };
      }
    }
  };
  
  handleDeleteProduct = async (productId) => {
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
        return {
          status: "success",
          msg: "Product was deleted successfully",
        };
      } else {
        throw new Error("Failed to delete Product. The Product may have existing sales records.");
      }
    } catch (error) {
      return {
        status: "failure",
        msg: error.message,
      };
    }
  };
  

  handleShowDelete = (productId) => {
    this.setState({ showDeleteModal: true, deleteProductId: productId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteProductId: null });
  };

  handleEditProduct = async (productId, updatedProduct) => {
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
  
        return {
          status: "success",
          msg: "Product was updated successfully",
        };
      } else {
        throw new Error("Failed to update Product");
      }
    } catch (error) {
      return { status: "failure", msg: error.message };
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
