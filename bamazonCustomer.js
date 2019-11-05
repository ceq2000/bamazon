/**
Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
The app should then prompt users with two messages.
The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.
**/
const mysql = require("mysql"),
    inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "\nName: " + res[i].product_name +
                "\nPrice: " + res[i].price + "\n \n");
        }
        runQuery();
    });
}

function runQuery() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Please enter the ID of the product you wish to purchase",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity you wish to purchase",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(answers) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { id: answers.id }, function(err, res) {
            if (err) throw err;
            var id = res[0].id;
            var newQuant = res[0].stock_quantity - answers.quantity,
                orderPrice = res[0].price * answers.quantity;
            var totalSales = res[0].product_sales + orderPrice;
            if (res[0].stock_quantity < answers.quantity) {
                console.log("Insufficient Quantity!");
                connection.end();
            } else {
                connection.query('UPDATE products SET ? WHERE id = ?', [{ stock_quantity: newQuant, product_sales: totalSales }, id],
                    function(err, res) {
                        console.log("Order successful! Total cost: $" + orderPrice);
                        inquirer.prompt([{
                            name: "confirm",
                            type: "confirm",
                            message: "Make another purchase?"
                        }]).then(function(answers) {
                            if (answers.confirm === true) {
                                displayProducts();
                            } else {
                                connection.end();
                            }
                        })

                    });
            }
        });
    })

}