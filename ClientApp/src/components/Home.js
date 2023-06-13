import React, { Component } from "react";

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h4>Welcome to my Onboarding React Project. </h4>
        <p>
          This project aims to provide a comprehensive solution for managing
          customers, products, stores, and sales. Whether you're a business
          owner or a salesperson, this application will help you streamline your
          operations and enhance your productivity.
        </p>
        <p>
          In the <a href="/customers">Customers</a> section, you will be able to manage customer
          information, including their names, and addresses. This will enable
          you to provide personalized services and build strong relationships
          with your customers.
        </p>
        <p>
          The <a href="/products">Products</a> section allows you to maintain a catalog of your
          products. You can add new products, update existing ones, or delete
          any discontinued products. This will help you ensure that your product
          list is up-to-date with the market and can fulfill customer orders
          efficiently.
        </p>
        <p>
          In the <a href="/stores">Stores</a> section, you can manage information related to your
          physical store locations. By organizing your store details in one place,
          you can easily communicate with your customers and provide them with
          accurate information.
        </p>
        <p>
          Lastly, the <a href="/sales">Sales</a> section provides a comprehensive overview of your
          sales data. You can view sales reports, analyze trends, and monitor
          the performance of your business. This will enable you to make
          informed decisions and identify areas for improvement.
        </p>
        <p>
          To navigate to the specific sections, please use the following links
          or <br /> use the Navbar at the top of the page:
        </p>
        <ul>
          <li>
            <a href="/customers">Customers</a>
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/stores">Stores</a>
          </li>
          <li>
            <a href="/sales">Sales</a>
          </li>
        </ul>
        <p>
          Feel free to explore the application and make the most of its
          features. If you have any questions or need assistance, don't hesitate
          to reach out.
        </p>
      </div>
    );
  }
}
