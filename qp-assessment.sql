-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 10, 2024 at 10:14 PM
-- Server version: 8.0.34-0ubuntu0.20.04.1
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qp-assessment`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint NOT NULL,
  `productName` varchar(40) DEFAULT NULL,
  `customerId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `file` text,
  `quantity` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `sale_price` float DEFAULT NULL,
  `status` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `productName`, `customerId`, `productId`, `file`, `quantity`, `discount`, `sale_price`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '211', 1, 1, 'http://localhost:8000/uploads/category.csv', 2, NULL, 10, 1, '2024-03-10 14:03:31', '2024-03-10 14:03:31');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint NOT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `total_items` int DEFAULT '0',
  `isPaid` int DEFAULT '0',
  `customerId` int DEFAULT NULL,
  `address` json DEFAULT NULL,
  `grand_total` float DEFAULT '0',
  `discount` float DEFAULT '0',
  `channel` varchar(255) DEFAULT '0',
  `shipping_charge` float DEFAULT '0',
  `delivery_method` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `tax_amount` float DEFAULT '0',
  `delivery_partner_id` int DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `delivery_date_time` datetime DEFAULT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `invoice`, `total_items`, `isPaid`, `customerId`, `address`, `grand_total`, `discount`, `channel`, `shipping_charge`, `delivery_method`, `payment_method`, `tax_amount`, `delivery_partner_id`, `transaction_id`, `delivery_date_time`, `order_status`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'order_01001', 'INV_01001', 1, 0, 1, '{\"city\": \"Karkala\", \"name\": \"John Doe\", \"state\": \"Karnataka\", \"country\": \"India\", \"postalCode\": \"574104\", \"addressLine1\": \"123 Main St\", \"addressLine2\": \"Apt 101\"}', 20, 100, 'WEB', 10, 'Home Devilery', 'COD', 3.05085, NULL, NULL, '1970-01-01 00:00:00', 'Received', 1, '2024-03-10 14:49:31', '2024-03-10 14:49:32');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `tax` float DEFAULT '0',
  `unit` varchar(255) DEFAULT NULL,
  `quantity` float DEFAULT '0',
  `unit_price` float DEFAULT '0',
  `discount` float DEFAULT '0',
  `sub_total` float DEFAULT '0',
  `productId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `order_number`, `name`, `file`, `tax`, `unit`, `quantity`, `unit_price`, `discount`, `sub_total`, `productId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'order_01001', '211', 'http://localhost:8000/uploads/category.csv', 3.05085, NULL, 2, 10, 50, 20, 1, 1, '2024-03-10 14:49:32', '2024-03-10 14:49:32');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `categories` text,
  `brand` text,
  `hsn` varchar(30) DEFAULT NULL,
  `barcode` varchar(40) DEFAULT NULL,
  `tax` int DEFAULT NULL,
  `description` longtext,
  `cover_file` varchar(100) DEFAULT NULL,
  `unit` varchar(10) DEFAULT NULL,
  `sku` varchar(30) DEFAULT NULL,
  `increment` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `min_quantity` float DEFAULT NULL,
  `max_quantity` float DEFAULT NULL,
  `files` json DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `purchase_price` float DEFAULT NULL,
  `mrp` float DEFAULT NULL,
  `sale_price` float DEFAULT NULL,
  `expired` datetime DEFAULT NULL,
  `stock` float DEFAULT NULL,
  `status` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `categories`, `brand`, `hsn`, `barcode`, `tax`, `description`, `cover_file`, `unit`, `sku`, `increment`, `weight`, `min_quantity`, `max_quantity`, `files`, `discount`, `purchase_price`, `mrp`, `sale_price`, `expired`, `stock`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '211', '1,2', NULL, NULL, NULL, 18, NULL, 'http://localhost:8000/uploads/category.csv', NULL, NULL, 1, 0, 1, 5, '[\"http://localhost:8000/uploads/x-circle(6).svg\", \"http://localhost:8000/uploads/login-img.c94f716d194cab3204a8.jpg\"]', 0, 0, 60, 50, '2024-03-15 00:00:00', 20, 1, '2024-03-10 14:03:13', '2024-03-10 14:03:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
