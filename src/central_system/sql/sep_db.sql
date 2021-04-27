
-- Heroku DB --- DO NOT REMOVE PLEASE
-- CREATE DATABASE heroku_398af5fddeed461;
-- USE heroku_398af5fddeed461;

CREATE DATABASE comp2913_sep;
USE comp2913_sep;

-- --------------------------------------------------------

SET @@auto_increment_increment=1;

--
-- Definition of the table `Card`
--

CREATE TABLE `Card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stripe_token` varchar(200) NOT NULL,
  `number` varchar(21) NOT NULL,
  `cvv` int(11) ,
  `expire_date` varchar(10) NOT NULL,
  `type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Image`
--

CREATE TABLE `Image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ext` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Facility`
--

CREATE TABLE `Facility` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `price` double NOT NULL,
  `capacity` double NOT NULL DEFAULT 1,
  `icon` varchar(400) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `FacilityImage`
--

CREATE TABLE `FacilityImage` (
  `id_image` int(11) NOT NULL,
  `id_facility` int(11) NOT NULL,
  PRIMARY KEY (`id_image`, `id_facility`),
  FOREIGN KEY(`id_image`) REFERENCES Image(`id`),
  FOREIGN KEY(`id_facility`) REFERENCES Facility(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer`
--

CREATE TABLE `Lecturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(500) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Sport`
--

CREATE TABLE `Sport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(5000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_pic` varchar(400) DEFAULT '',
  `name` varchar(400) NOT NULL,  
  `surname` varchar(400) NOT NULL,  
  `email` varchar(200) NOT NULL UNIQUE,
  `password` varchar(400) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `address_1` varchar(500) NOT NULL,
  `address_2` varchar(500) DEFAULT '',
  `zipcode` varchar(8) NOT NULL,  
  `city` varchar(200) NOT NULL,  
  `type` int(11) NOT NULL DEFAULT 1,
  `birth` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stripe_token` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Definition of the table `Pricing`
--

CREATE TABLE `Pricing` (
  
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sport` int(11) NOT NULL DEFAULT 1,
  
  -- 1: monthly, 2: yearly, 3: sports pass --
  `type` int(11) NOT NULL DEFAULT 1,
  
  `amount` double NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_sport`) REFERENCES Sport(`id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Membership`
--

CREATE TABLE `Membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_user` int(11) NOT NULL,
  `id_pricing` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_user`) REFERENCES User(`id`),
  FOREIGN KEY (`id_pricing`) REFERENCES Pricing(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Card_User`
--

CREATE TABLE `Card_User` (
  `id_card` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  FOREIGN KEY(`id_card`) REFERENCES Card(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`id_user`) REFERENCES User(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity`
--

CREATE TABLE `Activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `discount` double DEFAULT 0,
  `cost` double NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `id_facility` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`id_sport`) REFERENCES Sport(`id`),
  FOREIGN KEY(`id_facility`) REFERENCES Facility(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `ActivityImage`
--

CREATE TABLE `ActivityImage` (
  `id_image` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  PRIMARY KEY (`id_image`, `id_activity`),
  FOREIGN KEY(`id_image`) REFERENCES Image(`id`),
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Definition of the table `BookedActivity`
--

CREATE TABLE `BookedActivity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_activity` int(11) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Session`
--

CREATE TABLE `Session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer_Activity`
--

CREATE TABLE `Lecturer_Activity` (
  `id_lecturer` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  FOREIGN KEY(`id_lecturer`) REFERENCES Lecturer(`id`),
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Session`
--

CREATE TABLE `Activity_Session` (
  `id_activity` int(11) NOT NULL,
  `id_session` int(11) NOT NULL,
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`),
  FOREIGN KEY(`id_session`) REFERENCES Session(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Session`
--

CREATE TABLE `Log_User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`id_user`) REFERENCES User(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT 1,
  `amount` double NOT NULL,
  `id_card` int(11) NOT NULL DEFAULT 1,
  `id_booked_activity` int(11),
  `id_membership` int(11),
  `id_user` int(11) NOT NULL,
  `id_employee` int(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_booked_activity`) REFERENCES BookedActivity(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_membership`) REFERENCES Membership(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_card`) REFERENCES Card(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- SAMPLE DATA
--

-- Creating user (psw: 123456)
INSERT INTO User(name, surname, email, password, phone, address_1, zipcode, city) VALUES ('John', 'Doe', 'test@mail.com', 'e10adc3949ba59abbe56e057f20f883e', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating employee (psw: test123)
INSERT INTO User(name, surname, email, type, password, phone, address_1, zipcode, city) VALUES ('Mr', 'Employee', 'employee@mail.com', 2, 'cc03e747a6afbbcbf8be7668acfebee5', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating manager (psw: test123)
INSERT INTO User(name, surname, email, type, password, phone, address_1, zipcode, city) VALUES ('Mr', 'Admin', 'admin@mail.com', 3, 'cc03e747a6afbbcbf8be7668acfebee5', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating a Facility
INSERT INTO Facility (name, description, price, capacity, icon) VALUES ('Swimming Pool', 'Our world class swimming pool allows for innovative pool programmes that are designed for begginers in need of lessions, or competitive swimmers taking advantage of lane sessions. If this all sounds like hard work we also offer pool parties!', 5, 2, 'swim-white');
INSERT INTO Facility (name, description, price, capacity, icon) VALUES ('Fitness Room', 'We provide you with the latest fitness equipment combined with group fitness classes that will leave you wanting more. We make sure our fitness programmes are tailored for everyone, no matter their ability.', '10', 25, 'gym-white');
INSERT INTO Facility (name, description, price, capacity, icon) VALUES ('Squash Courts', 'We offer 4 state of the art squash courts for you to practice in. Book alone, in pairs or as a group, we can match you up with other players your level to test and enhance your abilities.', '8', 4, 'tennis-white');
INSERT INTO Facility (name, description, price, capacity, icon) VALUES ('Sports Hall', 'Our state of the art sports hall offeres enough room for many different sports. Whether you are trying a sport for the first time or have decided to start again, playing sport is a great way to get fit, stay healthy and meet new friends. You can also book out the sports hall for over, non-sport related activities.', '15', 20, 'running-white');

-- Create image references

-- Swimming Pool Images
INSERT INTO Image(ext) VALUES('jpg'); -- image 1
INSERT INTO Image(ext) VALUES('jpg'); -- image 2
INSERT INTO Image(ext) VALUES('jpg'); -- image 3
INSERT INTO Image(ext) VALUES('jpg'); -- image 4

--  Fitness room images
INSERT INTO Image(ext) VALUES('jpg'); -- image 1
INSERT INTO Image(ext) VALUES('jpg'); -- image 2
INSERT INTO Image(ext) VALUES('jpg'); -- image 3
INSERT INTO Image(ext) VALUES('jpg'); -- image 4

-- Squash court images

INSERT INTO Image(ext) VALUES('jpg'); -- image 1
INSERT INTO Image(ext) VALUES('jpg'); -- image 2
INSERT INTO Image(ext) VALUES('jpg'); -- image 3
INSERT INTO Image(ext) VALUES('jpg'); -- image 4

-- Sports hall images
INSERT INTO Image(ext) VALUES('jpg'); -- image 1
INSERT INTO Image(ext) VALUES('jpg'); -- image 2
INSERT INTO Image(ext) VALUES('jpg'); -- image 3


-- Create image/facility references

-- swimming pool image references
INSERT INTO FacilityImage(id_image, id_facility) VALUES (1,1);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (2,1);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (3,1);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (4,1);

-- Fitness room image references
INSERT INTO FacilityImage(id_image, id_facility) VALUES (5,2);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (6,2);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (7,2);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (8,2);

-- Squash courts image references
INSERT INTO FacilityImage(id_image, id_facility) VALUES (9,3);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (10,3);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (11,3);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (12,3);

-- Sports hall image references
INSERT INTO FacilityImage(id_image, id_facility) VALUES (13,4);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (14,4);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (15,4);

-- Creating a sport with an activity by a lecturer
INSERT INTO Sport(name, description) VALUES ('Swimming', 'Free swimming, Sub Classes, Competitive Freestyle Swimming.');
INSERT INTO Sport(name, description) VALUES ('Kick Box', 'Lightweight, agility-based martial arts discipline.');
INSERT INTO Sport(name, description) VALUES ('Football', 'Football description');
INSERT INTO Sport(name, description) VALUES ('Squash', 'Squash description');
INSERT INTO Sport(name, description) VALUES ('running', 'Running description');
INSERT INTO Sport(name, description) VALUES ('Gym Access', 'Allows you to use the fitness rooms equipment!'); -- Something for fitness room?


INSERT INTO Lecturer(full_name, email, phone) VALUES ('John Fish', 'iswimalot@gmail.com', '+44 1234567890');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Swimming for funsies', 'lets all go Swimminging, for fun!', 10, 60, 1, 1, '2020-05-12 15:30:10');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Kick Boxing for funsies', 'lets all go Kick Boxing, for fun!', 5, 60, 2, 1, '2020-05-12');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Football for funsies', 'lets all go Footballing, for fun!', 9.99, 60, 3, 2, '2020-05-14');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Squash for funsies', 'lets all go Squashing, for fun!', 8, 60, 4, 1, '2020-05-14 12:30:05');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('running for funsies', 'lets all go running, for fun!', 100, 60, 5, 1, '2020-05-15 10:00:00');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Gym Access for funsies', 'lets all go Gym Accessing, for fun!', 3, 60, 6, 1, '2020-05-15');
INSERT INTO Lecturer_Activity (id_lecturer, id_activity) VALUES (1, 1);

-- Creating a membership

-- monthly memberships
INSERT INTO Pricing (id_sport, type, amount) VALUES (1, 1, 10); -- swimming 
INSERT INTO Pricing (id_sport, type, amount) VALUES (2, 1, 8); -- kick box
INSERT INTO Pricing (id_sport, type, amount) VALUES (3, 1, 15); -- football
INSERT INTO Pricing (id_sport, type, amount) VALUES (4, 1, 4.99); -- squash
INSERT INTO Pricing (id_sport, type, amount) VALUES (5, 1, 6); -- running 
INSERT INTO Pricing (id_sport, type, amount) VALUES (6, 1, 10); -- gym access

-- annual memberships
INSERT INTO Pricing (id_sport, type, amount) VALUES (1, 2, 110); -- swimming
INSERT INTO Pricing (id_sport, type, amount) VALUES (2, 2, 90); -- kick box
INSERT INTO Pricing (id_sport, type, amount) VALUES (3, 2, 160); -- football
INSERT INTO Pricing (id_sport, type, amount) VALUES (4, 2, 50); -- squash
INSERT INTO Pricing (id_sport, type, amount) VALUES (5, 2, 70); -- running
INSERT INTO Pricing (id_sport, type, amount) VALUES (6, 2, 100); -- fitness

-- sports pass
INSERT INTO Pricing (type, amount) VALUES (3, 400);

INSERT INTO Membership(id_user, id_pricing) VALUES (1, 1);
INSERT INTO Membership(id_user, id_pricing, start_date) VALUES (1, 2, '2007-01-01 10:00');

-- Payment simulation
INSERT INTO Card (number, cvv, expire_date, type, stripe_token) VALUES ('0000', '000', '00/0000', '__CASH__', '');
INSERT INTO Card (number, cvv, expire_date, type, stripe_token) VALUES ('0000', '000', '00/0000', '__FREE__', ''); -- free payments

INSERT INTO Card_User(id_card, id_user) VALUES (1, 3); -- for now we add cash card to admin


INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-02-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-02-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);



