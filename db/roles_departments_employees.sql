INSERT INTO roles(title, salary, department_id)
VALUES
('Director', 100000, 1)
('CFO', 90000, 2)
('Sales Lead', 80000, 3)
('Sales Representative Specialist', 70000, 4)
('Sales Group Lead', 50000, 5)
('Janitor', 35000, 6)

INSERT INTO departments(department_name)
VALUES
('Untouchables')
('Sales')
('Regional')
('District')
('Custodial')
('HR Department')

INSERT INTO employees(first_name, last_name, role_id)
VALUES
('Carson','James','1')
('Barbara','Gilstrap','2')
('Katie','Holcombe','2')
('Xavier','Wilson','5')
('Nathan','McGuire','6')
('Adam','Bridges','4')
('Nicholas','Magallanes','3')


UPDATE `employees_db`,`employees` SET `manager_id` = '1' WHERE (`id > '1');
