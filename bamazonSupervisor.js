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
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Exit"],
      name: "supervisorsChoice"
    }
  ]).then(function (answer) {
    switch (answer.supervisorsChoice) {
      case "View Product Sales by Department":
        viewSales();
        break;
      case "Create New Department":
        newDept();
        break;
      case "Exit":
        connection.end();
    }
  });
}


function viewSales() {

  connection.query("SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales) total_sales, departments.over_head_costs - SUM(product_sales) AS total_profit FROM products INNER JOIN departments USING (department_name) GROUP BY department_name, departments.over_head_costs, departments.department_id",
  function (err, res) {
    if (err) throw err;
    console.table(res)
  })
  connection.end();
}


function newDept() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter new department name: ",
      name: "newDeptName"
    },
    {
      type: "input",
      message: "Enter overhead costs: ",
      name: "overhead",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {
    var deptName = answer.newDeptName;
    var overhead = answer.overhead;
    connection.query("INSERT INTO departments SET ?",
      {
        department_name: deptName,
        over_head_costs: overhead
      }, function (err, res) {
        if (err) throw err;
        console.log("Department added.")
      })
    connection.end();

  })

};


start()

// 

//    * Create New Department