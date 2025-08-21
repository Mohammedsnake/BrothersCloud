-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2025 at 06:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brotherscloud`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_date` date NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_description` text DEFAULT NULL,
  `repetition` enum('yearly','once') DEFAULT 'once',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notified_on_day` datetime DEFAULT NULL,
  `notified_before_day` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `user_id`, `event_date`, `event_name`, `event_description`, `repetition`, `created_at`, `notified_on_day`, `notified_before_day`) VALUES
(13, 4, '2005-06-12', 'MO\'s Birthday', 'Mohammed Aminu Shehe was born on this day', 'yearly', '2025-08-18 14:11:02', NULL, NULL),
(19, 4, '2025-08-21', 'Test Event', 'This is a test event for notifier', 'once', '2025-08-21 06:49:58', '2025-08-21 12:32:02', NULL),
(22, 4, '2025-08-21', 'Testing2', NULL, 'once', '2025-08-21 13:00:23', '2025-08-21 19:00:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `file_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_type` enum('image','document','video') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_description` text DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) UNSIGNED DEFAULT 0,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`file_id`, `user_id`, `file_type`, `file_name`, `file_description`, `file_path`, `file_size`, `uploaded_at`) VALUES
(29, 4, 'image', 'LPU Campus', 'This is my PC profile picture', '/uploads/images/1755525776493_lpu-campus.jpg', 773886, '2025-08-18 14:02:56'),
(30, 4, 'document', 'Bonafide Letter', 'Mohammed\'s Bonafide Letter of LPU', '/uploads/documents/1755525826092_Bonafide.pdf', 361514, '2025-08-18 14:03:46'),
(31, 4, 'document', 'Report Format', 'The Training Report Format', '/uploads/documents/1755525848600_Format_summer_training_Report.pdf', 235289, '2025-08-18 14:04:08'),
(32, 4, 'document', 'MO\'s CV', 'My CV-2025', '/uploads/documents/1755525897708_MY_CURRICULUM_VITAE.docx', 16970, '2025-08-18 14:04:57'),
(33, 4, 'document', 'MO\'s Report', 'My Full report- eGAZ 2025', '/uploads/documents/1755525940374_Summer_Training_Report.docx', 167065, '2025-08-18 14:05:40'),
(34, 4, 'document', 'Minor Project Synopsis', 'Our Synopsis for Minor Project- 4th sem', '/uploads/documents/1755526003755_Minor_Project_Synopsis.pdf', 434996, '2025-08-18 14:06:43'),
(35, 4, 'document', 'YUVA- Offer Letter', 'Internship Offer Letter by YUVA', '/uploads/documents/1755526115011_offer-letter-_YUVA.pdf', 132238, '2025-08-18 14:08:35'),
(36, 4, 'video', 'MO11\'s Farewell 2025', 'Italy Kids with Glorious Friends', '/uploads/videos/1755526177889_video.mp4', 9098592, '2025-08-18 14:09:38');

-- --------------------------------------------------------

--
-- Table structure for table `search_index`
--

CREATE TABLE `search_index` (
  `search_id` int(11) NOT NULL,
  `item_type` enum('file','event') NOT NULL,
  `item_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `search_index`
--

INSERT INTO `search_index` (`search_id`, `item_type`, `item_id`, `title`, `description`, `created_at`) VALUES
(1, 'file', 1, 'Family Picnic', 'Photo from Zanzibar trip', '2025-08-15 16:14:53'),
(2, 'file', 2, 'Birth Certificate', 'Ali Juma Shehe Birth Certificate', '2025-08-15 16:14:53'),
(3, 'file', 3, 'Wedding Video', 'Fatma wedding ceremony video', '2025-08-15 16:14:53'),
(4, 'event', 1, 'Christmas Gathering', 'Family Christmas dinner at home', '2025-08-15 16:14:53'),
(5, 'event', 2, 'Ali Birthday', 'Cake cutting at 8 PM', '2025-08-15 16:14:53'),
(6, 'event', 3, 'School Graduation', 'Fatma graduation from university', '2025-08-15 16:14:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `middle_name`, `last_name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Aminu', 'Shehe', 'Juma', 'amsheju77@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19'),
(2, 'Fahima', 'Mohamed', 'Issa', 'famissa77@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19'),
(3, 'Abdul-rahman', 'Aminu', 'Shehe', 'Manisalachu27@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19'),
(4, 'Mohammed', 'Aminu', 'Shehe', 'mosnake111@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19'),
(5, 'Abdul-warith', 'Aminu', 'Shehe', 'abdulwarith10@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19'),
(6, 'Mundhir', 'Aminu', 'Shehe', 'mundhiraminu@gmail.com', '$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq', '2025-08-15 16:13:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_event_name` (`event_name`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_file_name` (`file_name`);

--
-- Indexes for table `search_index`
--
ALTER TABLE `search_index`
  ADD PRIMARY KEY (`search_id`),
  ADD KEY `idx_search_title` (`title`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `search_index`
--
ALTER TABLE `search_index`
  MODIFY `search_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
