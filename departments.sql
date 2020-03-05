USE bamazon;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 10000), 
("Clothing", 10000),
("Pet Supplies", 10000),
("Home", 10000),
("Kitchen", 10000),
("Books", 10000),
("Grocery", 10000);
