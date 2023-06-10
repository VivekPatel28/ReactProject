import React from "react";

export class EditStoreModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
    };
  }

  componentDidMount() {
    const { storeId, stores } = this.props;
    const store = stores.find((c) => c.id === storeId);
    if (store) {
      this.setState({
        name: store.name.trim(),
        address: store.address.trim(),
      });
    }
  }

  handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value.trim() });
  };

  handleSave = async () => {
    const { storeId, onEditStore } = this.props;
    const { name, address } = this.state;
    const updatedStore = { id: storeId, name, address };
    await onEditStore(storeId, updatedStore);
  };

  render() {
    const { onCloseModal } = this.props;
    const { name, address } = this.state;
    return (
      <div onClick={onCloseModal} className="overlay" tabIndex="-1" role="dialog">
        <div onClick={(e)=>{e.stopPropagation()}} className="modalContainer" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Store</h5>
              <button
                type="button"
                className="btn border-black btnGray btn-sm m-1"
                onClick={onCloseModal}
              >X</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={address}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btnGray border-black"
                onClick={this.handleSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
