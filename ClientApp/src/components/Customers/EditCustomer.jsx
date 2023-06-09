import React from "react";

export class EditCustomerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
    };
  }

  componentDidMount() {
    const { customerId, customers } = this.props;
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      this.setState({
        name: customer.name.trim(),
        address: customer.address.trim(),
      });
    }
  }

  handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = () => {
    const { customerId, onEditCustomer } = this.props;
    const { name, address } = this.state;
    const updatedCustomer = { id: customerId, name, address };
    onEditCustomer(customerId, updatedCustomer);
  };

  render() {
    const { onCloseModal } = this.props;
    const { name, address } = this.state;
    return (
      <div onClick={onCloseModal} className="overlay" tabIndex="-1" role="dialog">
        <div onClick={(e)=>{e.stopPropagation()}} className="modalContainer" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Customer</h5>
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
