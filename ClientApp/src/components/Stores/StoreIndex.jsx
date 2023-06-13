import React from "react";
import { AddStore } from "./AddStore";
import { StoresTable } from "./StoresTable";
import { EditStoreModal } from "./EditStore";
import toastr from "toastr";
import "toastr/build/toastr.css";

export class Stores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      sales:[],
      loading: true,
      showEditModal: false,
      editStoreId: null,
      showDeleteModal: false,
      deleteStoreId: null,
    };
  }

  componentDidMount() {
    this.fetchStores();
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

  handleAddStore = async (newStore) => {
    if (newStore.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (newStore.address === "") {
      toastr.error("Please enter a valid Address", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }

    const duplicateStore = this.state.stores.find(
      (store) =>
        store.name.trim() === newStore.name &&
        store.address.trim() === newStore.address
    );
    if (duplicateStore) {
      toastr.error(
        "Duplicate Record, Please check the Store details again",
        "",
        { positionClass: "toast-center" }
      );
      return { status: "failure" };
    } else {
      try {
        const response = await fetch("api/Stores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStore),
        });

        if (response.ok) {
          const data = await response.json();
          const newId = data.id;
          const newFinalStore = {
            ...newStore,
            id: newId,
          };
          this.setState((prevState) => ({
            stores: [...prevState.stores, newFinalStore],
          }));
          toastr.success("Store was added successfully");
          return { status: "success" };
        } else {
          toastr.error("Failed to add Store", "", {
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

  handleDeleteStore = async (storeId) => {
    const dataExist = this.state.sales.find(
      (sales) => 
      sales.storeId === storeId
    )
    if (dataExist) {
      toastr.error(
        "Failed to delete this store. The store may have existing sale records.",
        "",
        { positionClass: "toast-center" }
      );
      this.handleCloseDelete();
      return {};
    }
    try {
      const response = await fetch(`api/Stores/${storeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.setState((prevState) => ({
          stores: prevState.stores.filter((store) => store.id !== storeId),
        }));
        this.handleCloseDelete();
        toastr.success("Store was deleted successfully");
      } 
    } catch (error) {
      toastr.error("Failed to delete the store");
    }
  };

  handleShowDelete = (storeId) => {
    this.setState({ showDeleteModal: true, deleteStoreId: storeId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteStoreId: null });
  };

  handleEditStore = async (storeId, updatedStore) => {
    if (updatedStore.name === "") {
      toastr.error("Please enter a valid Name", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    } else if (updatedStore.address === "") {
      toastr.error("Please enter a valid Address", "", {
        positionClass: "toast-center",
      });
      return { status: "failure" };
    }
    const duplicateStore = this.state.stores.find(
      (store) =>
        store.name.trim() === updatedStore.name &&
        store.address.trim() === updatedStore.address
    );
    const noChange = this.state.stores.find(
      (store) =>
        store.id === storeId &&
        store.name.trim() === updatedStore.name &&
        store.address.trim() === updatedStore.address
    );
    if (noChange) {
      toastr.error(
        'No changes found, Please make the required changes and click "Save changes" or cancel the update',
        "",
        { positionClass: "toast-center" }
      );
    } else if (duplicateStore) {
      toastr.error(
        "Duplicate Record, Please check the Store details again",
        "",
        { positionClass: "toast-center" }
      );
      return { status: "failure" };
    } else {
      try {
        const response = await fetch(`api/Stores/${storeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStore),
        });

        if (response.ok) {
          this.setState((prevState) => ({
            stores: prevState.stores.map((store) =>
              store.id === storeId ? updatedStore : store
            ),
            showEditModal: false,
            editStoreId: null,
          }));
          toastr.success("Store was updated successfully");
        } else {
          toastr.error("Failed to update store, Please try again", "", {
            positionClass: "toast-center",
          });
        }
      } catch (error) {
        toastr.error(error.message, "", { positionClass: "toast-center" });
      }
    }
  };

  handleOpenEditModal = (storeId) => {
    this.setState({ showEditModal: true, editStoreId: storeId });
    console.log(storeId);
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editStoreId: null });
  };

  render() {
    const {
      loading,
      stores,
      showEditModal,
      editStoreId,
      showDeleteModal,
      deleteStoreId,
    } = this.state;
    return (
      <div className="col-12 row">
        <div className="col-6">
          <h1>Stores</h1>
        </div>
        <div className="col-6 py-1 text-end">
          <AddStore handleAddStore={this.handleAddStore} />
        </div>

        {loading ? (
          <p>
            <em>Loading...</em>
          </p>
        ) : (
          <div className="container p-2">
            <div className="row pt-4">
              <div className="col-12">
                <StoresTable
                  stores={stores}
                  showDeleteModal={showDeleteModal}
                  deleteStoreId={deleteStoreId}
                  handleShowDelete={this.handleShowDelete}
                  handleCloseDelete={this.handleCloseDelete}
                  onDeleteStore={this.handleDeleteStore}
                  onOpenEditModal={this.handleOpenEditModal}
                />
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <EditStoreModal
            storeId={editStoreId}
            stores={stores}
            onEditStore={this.handleEditStore}
            onCloseModal={this.handleCloseEditModal}
          />
        )}
      </div>
    );
  }
}
