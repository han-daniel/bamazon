var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");

});
  console.log("Displaying all products...\n");
connection.query("SELECT * FROM products", function(err, res) {
  if (err) throw err;
      console.log("Product List: \n");
    for(var i = 0; i < res.length; i++){
        console.log(res[i].item_id + ": " + res[i].product_name + "\n   Price: $" + res[i].price + "\n------------------------------------------------");
    };
});

doThing();


function doThing(){
    inquirer
      .prompt([

          {
          type: 'input',
            name: 'productChoice',
            message: 'Please choose a Product ID to buy',
            validate: function(idvalue){
                idvalue = parseInt(idvalue);
                if((Number.isInteger(idvalue)) === true){   
                  if(idvalue > 0 && idvalue <= 10){

                    return true;
                  }
                  else{
                    return "Please enter a whole number/ An ID that exists";
                  }
                }
                else{
                  return "Please enter a whole number/ An ID that exists";
                }
            }
          },
    {
    type: 'input',
      name: 'quantity',
      message: 'How many units would you like to buy?',
      validate: function(value){
          value = parseInt(value);
          if((Number.isInteger(value)) === true){
            return true;
          }
          else{
            return "Please enter a whole number";
          }
      }
    }

    ])
      .then(answers => {

    connection.query("SELECT * FROM products", function(err, reso) {

      if (err) throw err;

        console.log(reso[answers.productChoice - 1].stock_quantity);
        if(reso[answers.productChoice - 1].stock_quantity < answers.quantity){
          console.log("Insufficient Quantity!");
        }
        else{
            console.log("Sold! \n");
            console.log(reso[answers.productChoice - 1].product_name);
            console.log("Your total is: " + (parseFloat(answers.quantity * reso[answers.productChoice - 1].price)).toFixed(2));
            reso[answers.productChoice - 1 ].stock_quantity = reso[answers.productChoice - 1].stock_quantity - answers.quantity
            console.log("-------------------------------------------------------------");

              console.log("Products updated!\n");
            var query = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: reso[answers.productChoice - 1].stock_quantity
                },
                {
                  product_name: reso[answers.productChoice - 1].product_name
                }
              ],
              function(err, res) {

               console.log("New Quantity for " + reso[answers.productChoice - 1].product_name + ":\n" + reso[answers.productChoice - 1].stock_quantity);
              }
            );
        }

      connection.end();
    });

      });
  }