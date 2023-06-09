import React from "react";
import { AddStore } from "./AddStore";
import { StoresTable } from "./StoresTable";
import { EditStoreModal } from "./EditStore";

export class Stores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      loading: true,
      showEditModal: false,
      editStoreId: null,
      showDeleteModal: false,
      deleteStoreId: null,
    };
  }

  componentDidMount() {
    this.fetchStores();
  }

  fetchStores = () => {
    fetch("api/Stores")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ stores: data, loading: false });
      });
  };

  handleAddStore = (newStore) => {
    if (newStore.name === "") {
      return { status: "failure", msg: "Please Enter a valid Store Name" };
    } else if (newStore.address === "") {
      return { status: "failure", msg: "Please Enter a valid Store Address" };
    }

    const duplicateStore = this.state.stores.find(
      (store) =>
        store.name.trim() === newStore.name && store.address.trim() === newStore.address
    );
    if (duplicateStore) {
      return { status: "failure", msg: "Duplicate Record" };
    } else {
      fetch("api/Stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStore),
      })
        .then((response) => response.json())
        .then((data) => {
          const newId = data.id;
          const newFinalStore = {
            ...newStore,
            id: newId,
          };
          this.setState((prevState) => ({
            stores: [...prevState.stores, newFinalStore],
          }));
        })
        .catch((error) => {
          return { status: "failure", msg: error.message };
        });
      return {
        status: "success",
        msg: "Store was added successfully",
      };
    }
  };

  handleDeleteStore = (storeId) => {
    fetch(`api/Stores/${storeId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          this.setState((prevState) => ({
            stores: prevState.stores.filter((store) => store.id !== storeId),
          }));
          this.handleCloseDelete();
        } else {
          throw new Error("Failed to delete Store");
        }
      })
      .catch((error) => {
        return { status: "failure", msg: error.message };
      });
      return {
        status: "success",
        msg: "Store was deleted successfully",
      };
  };

  handleShowDelete = (storeId) => {
    this.setState({ showDeleteModal: true, deleteStoreId: storeId });
  };

  handleCloseDelete = () => {
    this.setState({ showDeleteModal: false, deleteStoreId: null });
  };

  handleEditStore = (storeId, updatedStore) => {
    fetch(`api/Stores/${storeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStore),
    })
      .then((response) => {
        if (response.ok) {
          this.setState((prevState) => ({
            stores: prevState.stores.map((store) =>
              store.id === storeId ? updatedStore : store
            ),
            showEditModal: false,
            editStoreId: null,
          }));
          return {
            status: "success",
            msg: "Store was updated successfully",
          };
        } else {
          throw new Error("Failed to update Store");
        }
      })
      .catch((error) => {
        return { status: "failure", msg: error.message };
      });
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
