/**
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
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
    displayOptions();
});

function displayOptions() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then(function(answers) {
        switch (answers.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNew();
                break;
        }

    });
}

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "\nName: " + res[i].product_name +
                "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
        }
        inquirer.prompt([{
            name: "confirm",
            type: "confirm",
            message: "Return to main menu?"
        }]).then(function(answers) {
            if (answers.confirm === true) {
                displayOptions();
            } else {
                connection.end();
            }
        })

    });
}

function viewLow() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "\nName: " + res[i].product_name +
                "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
        }
        inquirer.prompt([{
            name: "confirm",
            type: "confirm",
            message: "Return to main menu?"
        }]).then(function(answers) {
            if (answers.confirm === true) {
                displayOptions();
            } else {
                connection.end();
            }
        })

    });

}

function addInventory() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Please enter the ID of the product you wish to restock",
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
            message: "Please enter the quantity you wish to add to current inventory",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(answers) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answers.quantity + " WHERE ?", {id: answers.id},
                function(err, res) {
                	if (err) throw err;
                    console.log("Inventory added!");
                    inquirer.prompt([{
                        name: "confirm",
                        type: "confirm",
                        message: "Return to main menu?"
                    }]).then(function(answers) {
                        if (answers.confirm === true) {
                            displayOptions();
                        } else {
                            connection.end();
                        }
                    })
                });

        });
}

function addNew() {
    inquirer.prompt([{
            type: "input",
            name: "name",
            message: "Product name:",
        },
        {
            type: "input",
            name: "department",
            message: "Product department:",
        },
        {
            type: "input",
            name: "price",
            message: "Price:",
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
            message: "Quantity:",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(answers) {
        var query = connection.query("INSERT INTO products SET ?", {
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            function(err, res) {
            	if (err) throw err;
                console.log(res.affectedRows + " product added!");
                inquirer.prompt([{
                    name: "confirm",
                    type: "confirm",
                    message: "Return to main menu?"
                }]).then(function(answers) {
                    if (answers.confirm === true) {
                        displayOptions();
                    } else {
                        connection.end();
                    }
                })
            });

    })
}