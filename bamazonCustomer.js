var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "bamazon"
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // for (var i = 0; i < res.length; i++) {
    //   console.log(res[i].item_id + " " + res[i].product_name + " " + res[i].price)
    // }
    console.table(res);
    purchaseProduct();
  });
}
readProducts();

function purchaseProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ID of the product you would like to purchase",
        name: "productID",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        type: "input",
        message: "How many would you like to buy?",
        name: "quantity",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      var quantity = parseInt(answer.quantity);
      var query = "SELECT product_name, item_id, stock_quantity, price FROM products WHERE ?";
      var productToBuy = answer.productID;
      connection.query(query, { item_id: productToBuy }, function (err, res) {
        if (err) throw err;
        var stock = res[0].stock_quantity
        // console.log(res[0])
        // console.log(stock)
        if (quantity > stock) {
          console.log("Insufficient quantity!")
          connection.end();
        } else {
          stock -= quantity;
          // console.log("New stock: " + stock)
          updateStock(stock, answer.productID);
          var totalSale = parseFloat(quantity * res[0].price)
          console.log("Your total is $" + totalSale)
          updateProductSales(productToBuy, totalSale);
        }
      });
    });

}

function updateStock(stock, productID) {
  connection.query(
    "UPDATE products SET ? WHERE ?", [{ stock_quantity: stock }, { item_id: productID }], function (err, res) {
      if (err) throw err;
      // console.log(res.affectedRows + " products updated!\n");
    })
}

function updateProductSales(productToBuy, totalSale) {
  connection.query("SELECT product_sales FROM products WHERE ?", { item_id: productToBuy }, function (err, res) {
    if (err) throw err;
    var sales = res[0].product_sales;
    sales += totalSale;

    connection.query(
      "UPDATE products SET ? WHERE ?", [{ product_sales: sales }, { item_id: productToBuy }], function (err, res) {
        if (err) throw err;

        console.log(res.affectedRows + " products updated!\n");
          connection.end();

      })
  })

}
// console.table
// cli-table