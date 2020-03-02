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

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "managersChoice"
            }
        ]
        ).then(function (answer) {
            switch (answer.managersChoice) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Exit":
                    connection.end();
            }
        });
}
start();

function viewProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res)
        connection.end();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        if (Object.entries(res).length === 0) {

            console.log("There are no items with low inventory")
        } else {
            console.table(res)
        }
        connection.end();
    })
}

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the product you would like to add",
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
            message: "How many would you like to add?",
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var productID = answer.productID;
        var quantity = parseInt(answer.quantity);
        connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: productID }, function (err, res) {
            if (err) throw err;
            var stock = res[0].stock_quantity;
            stock += quantity;
            console.log("New stock: " + stock)
            addStock(productID, stock);
        })

    })
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the product you would like to add",
            name: "newProduct"
        },
        {
            type: "input",
            message: "Enter department",
            name: "newDepartment"
        },
        {
            type: "input",
            message: "Enter price",
            name: "newPrice",
            validate: function (value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message: "Enter quantity",
            name: "newStock",
            validate: function (value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(answer){
        var newProduct = answer.newProduct;
        var newDept = answer.newDepartment;
        var newPrice = parseFloat(answer.newPrice);
        var newInvent = parseInt(answer.newStock);
        connection.query("INSERT INTO products SET ?", {
            product_name: newProduct,
            department_name: newDept,
            price: newPrice,
            stock_quantity: newInvent 
        }, function(err, res) {
            if (err) throw err;
            console.log("Product added");
            connection.end();
        })
        
    })
}


function addStock(product, stock) {
    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: stock }, { item_id: product }], function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
    })
    connection.end();
}