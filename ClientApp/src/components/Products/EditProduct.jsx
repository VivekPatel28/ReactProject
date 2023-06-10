import React from "react";

export class EditProductModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: "",
    };
  }

  componentDidMount() {
    const { productId, products } = this.props;
    const product = products.find((c) => c.id === productId);
    if (product) {
      this.setState({
        name: product.name.trim(),
        price: product.price,
      });
    }
  }

  handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = async () => {
    const { productId, onEditProduct } = this.props;
    const { name, price } = this.state;
    const updatedProduct = { id: productId, name, price };
    await onEditProduct(productId, updatedProduct);
  };

  render() {
    const { onCloseModal } = this.props;
    const { name, price } = this.state;
    return (
      <div onClick={onCloseModal} className="overlay" tabIndex="-1" role="dialog">
        <div onClick={(e)=>{e.stopPropagation()}} className="modalContainer" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Product</h5>
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
                <label>Price</label>
                <input
                  type="text"
                  className="form-control"
                  name="price"
                  value={price}
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
