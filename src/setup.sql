create database vacationTable;

use vacationTable;

create table users (
ID int not null auto_increment,
firstName varchar(20) not null,
lastName varchar(20) not null,
userName varchar(20) not null,
password varchar(255) not null,
isAdmin TINYINT NOT NULL DEFAULT 0,
primary key (ID)
);

insert into users (firstName, lastName, userName, password, isAdmin)
value ('eliran','zino', 'admin','$2b$10$WlArn4sxnabEdOS6pPSU4O9iMivgnaXXH50HatnKGN7Tt7SlBmTQq', 1);

create table vacationTable.vacations(
ID INT not null auto_increment,
description VARCHAR(200) not null,
destination VARCHAR(200) not null,
picture varchar(255) not null,
departure dateTime not null,
returnAt dateTime not null,
price varchar(200)  not null,
followersAmount int not null default 0,
primary key (ID)
);

INSERT INTO vacations (description, destination, picture, departure, returnAt, price) 
VALUES('GuideTour', 'China', 'https://ehlion.com/fileadmin/_processed_/7/7/csm_AdobeStock_100408242_ec82805479.jpeg','2020-08-08','2020-09-08', 3400),
('Relaxing', 'Cyprus', 'https://www.gannett-cdn.com/presto/2019/11/14/USAT/56560475-1e70-4a30-906d-de5216001821-cyprus-01-nissi-beach.jpg?crop=2120,1193,x0,y222&width=660&height=372&format=pjpg&auto=webp','2020-08-14', '2020-08-20', 2600),
('MuseumTour', 'Israel','https://images.haarets.co.il/image/fetch/x_80,y_15,w_576,h_576,c_crop/q_auto,h_1200,w_1200,c_fill,f_auto/fl_lossy.any_format.preserve_transparency.progressive:none/https://www.haaretz.co.il/polopoly_fs/1.5937961!/image/786756527.jpg', '2020-09-15', '2020-09-22', 3200),
('Adventure', 'BlackForest','https://cdn.britannica.com/40/83440-050-E7404870/Farm-buildings-region-Black-Forest-Ger-Baden-Wurttemberg.jpg', '2020-10-01', '2020-10-08', 4600),
('Historical', 'Greece', 'https://farm8.staticflickr.com/7449/14172886184_a4d44f5086_z.jpg', '2020-08-19','2020-08-27',4000);

create table vacationTable.users_vacations (
userId int not null,
vacationId int not null,
isFollow TINYINT NOT NULL DEFAULT 1,
primary key (vacationId, userId)
);

