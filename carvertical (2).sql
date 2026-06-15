-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2026 at 04:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carvertical`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(40) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','responded') NOT NULL DEFAULT 'new',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`) VALUES
(0, 'Maxime qui praesenti', 'Architecto sunt labo', 'Tempora enim culpa c', 'Lorem sed veniam is', 'new', '2026-04-23 18:37:28');

-- --------------------------------------------------------

--
-- Table structure for table `email_failures`
--

CREATE TABLE `email_failures` (
  `id` int(11) NOT NULL,
  `to_address` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_outbox`
--

CREATE TABLE `email_outbox` (
  `id` int(11) NOT NULL,
  `to_address` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `preview_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(64) DEFAULT NULL,
  `customer_email` varchar(255) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `identification_type` varchar(20) NOT NULL,
  `identification_value` varchar(100) NOT NULL,
  `vin_number` varchar(50) DEFAULT NULL,
  `package_type` varchar(50) NOT NULL,
  `country_code` varchar(10) NOT NULL DEFAULT 'US',
  `state` varchar(100) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `payment_provider` varchar(50) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','processing','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `report_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_email`, `vehicle_type`, `identification_type`, `identification_value`, `vin_number`, `package_type`, `country_code`, `state`, `currency`, `amount`, `payment_status`, `payment_provider`, `payment_id`, `status`, `report_url`, `created_at`, `updated_at`, `completed_at`) VALUES
(2, 'ORD-20260423-00002', 'sehrishnadeem39@gmail.com', 'Boat', 'vin', 'DSFREEEDREGFFREG', 'DSFREEEDREGFFREG', 'basic', 'US', NULL, 'USD', 40.00, 'pending', 'paddle:pri_01kpx4cfcq5e5yx745387mv0t9', NULL, 'pending', NULL, '2026-04-23 18:37:14', '2026-04-23 18:37:14', NULL),
(3, 'ORD-20260423-00003', 'sehrishnadeem39@gmail.com', 'Truck', 'vin', 'RFRTR', 'RFRTR', 'basic', 'US', NULL, 'USD', 40.00, 'pending', 'paddle:pri_01kpx4cfcq5e5yx745387mv0t9', NULL, 'pending', NULL, '2026-04-23 18:55:12', '2026-04-23 18:55:12', NULL),
(4, 'ORD-20260423-00004', 'sehrishnadeem39@gmail.com', 'Boat', 'vin', 'DSFREEEDREGFFREG', 'DSFREEEDREGFFREG', 'basic', 'US', NULL, 'USD', 40.00, 'pending', 'paddle:pri_01kpx69v8srys2nn3vvs0hpd7n', NULL, 'pending', NULL, '2026-04-23 19:09:30', '2026-04-23 19:09:30', NULL),
(5, 'ORD-20260423-00005', 'sehrishnadeem39@gmail.com', 'Truck', 'vin', 'DSFREEEDREGFFREG', 'DSFREEEDREGFFREG', 'basic', 'US', NULL, 'USD', 40.00, 'pending', 'paddle:pri_01kpx69v8srys2nn3vvs0hpd7n', NULL, 'pending', NULL, '2026-04-23 19:10:55', '2026-04-23 19:10:55', NULL),
(6, 'ORD-20260423-00006', 'sehrishnadeem39@gmail.com', 'Boat', 'vin', 'DSFREEEDREGFFREG', 'DSFREEEDREGFFREG', 'premium', 'US', NULL, 'USD', 80.00, 'pending', 'paddle:pri_01kpx4fm2507zmkc96027k7ycw', NULL, 'pending', NULL, '2026-04-23 19:14:40', '2026-04-23 19:14:40', NULL),
(7, 'ORD-20260423-00007', 'sehrishnadeem39@gmail.com', 'Truck', 'vin', 'DSFREEEDREGFFREG', 'DSFREEEDREGFFREG', 'premium', 'US', NULL, 'USD', 80.00, 'pending', 'paddle:pri_01kpx4fm2507zmkc96027k7ycw', NULL, 'pending', NULL, '2026-04-23 19:17:46', '2026-04-23 19:17:46', NULL),
(8, 'ORD-20260423-00008', 'sehrishnadeem39@gmail.com', 'Boat', 'vin', 'FFFSFSDFSDFSDDFSD', 'FFFSFSDFSDFSDDFSD', 'basic', 'US', NULL, 'USD', 40.00, 'pending', 'paddle:pri_01kpx4cfcq5e5yx745387mv0t9', NULL, 'pending', NULL, '2026-04-23 19:25:28', '2026-04-23 19:25:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_payment_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `name`, `email`, `rating`, `comment`, `status`, `created_at`, `approved_at`) VALUES
(3, 'Sehrish Nadeem', 'sehrishnadeem39@gmail.com', 5, 'sss', 'pending', '2026-04-23 18:54:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `key` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_registrations`
--

CREATE TABLE `vehicle_registrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `registration_number` varchar(64) DEFAULT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `vehicle_title` varchar(255) NOT NULL,
  `vehicle_year` int(11) DEFAULT NULL,
  `vehicle_make` varchar(100) DEFAULT NULL,
  `vehicle_model` varchar(100) DEFAULT NULL,
  `vehicle_type` varchar(100) DEFAULT NULL,
  `vin` varchar(50) DEFAULT NULL,
  `license_plate` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `images_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images_json`)),
  `payment_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `approved_by` varchar(255) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `owner_phone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_registration_images`
--

CREATE TABLE `vehicle_registration_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `registration_id` bigint(20) UNSIGNED NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `image_type` varchar(50) DEFAULT NULL,
  `image_size` bigint(20) DEFAULT NULL,
  `image_data` longblob DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
