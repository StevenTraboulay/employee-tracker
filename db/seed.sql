use employees;

INSERT INTO department
    (name)

VALUES
('Sales'),
('Mad Scientist'),
('Finance'),
('Legal');

INSERT INTO role
(title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Sales Grunt', 40000, 1),
('Head Evil Scientist', 200000, 2),
('Thralls', 10000, 2),
('Accountant Lead', 110000, 3),
('Accountant bookie', 50000, 3),
('Legal Head', 200000, 4),
('Evil Lawyer', 100000, 4);

INSERT employee
    (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Snow', 1, NULL),
('Roger', 'Robotnik', 2, 1),
('David', 'Duchovney', 3, NULL),
('John', 'Loch', 4, 3),
('EdgarAllen', 'Poe', 5, NULL),
('Optimus', 'Prime', 6, 5),
('Magnetic', 'Brotherhood', 7, NULL),
('Harry', 'Potter', 8, 7);