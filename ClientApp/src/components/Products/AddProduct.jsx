import React from "react";

export class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements.productName.value.trim();
    const price = e.target.elements.productPrice.value.trim();

    try {
      const resp = await this.props.handleAddProduct({
        name: name,
        price: price,
      });

      if (resp.status === "success") {
        document.querySelector(".product-form").reset();
        this.handleClose();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const { show } = this.state;
    return (
      <div className="col-12 text-white p-2">
        <button className="btn border-black btnGray" onClick={this.handleShow}>
          Create a New Product
        </button>
        {show && (
          <div onClick={this.handleClose} className="overlay">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="modalContainer"
            >
              <div className="col-12">
                <div className="col-12 row">
                  <h2 className="col-8 text-center text-black pt-3">
                    Create a new Product
                  </h2>
                  <div className="col-4 text-end p-3">
                    <button
                      className="btn border-black btnGray btn-sm m-1"
                      onClick={this.handleClose}
                    >
                      X
                    </button>
                  </div>
                </div>
                <form onSubmit={this.handleFormSubmit} className="product-form">
                  <input hidden name="customertId"></input>
                  <div className="col-6 col-md-8 p-3">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Name..."
                      name="productName"
                    ></input>
                  </div>
                  <div className="col-6 col-md-8 p-3">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Price..."
                      name="productPrice"
                    ></input>
                  </div>
                  <div className="col-6 p-3">
                    <button className="btn border-black btnGray form-control">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
