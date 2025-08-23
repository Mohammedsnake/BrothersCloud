-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2025 at 08:11 PM
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
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cloudinary_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`file_id`, `user_id`, `file_type`, `file_name`, `file_description`, `file_path`, `file_size`, `uploaded_at`, `cloudinary_url`) VALUES
(30, 4, 'document', 'Bonafide Letter', 'Mohammed\'s Bonafide Letter of LPU', '/uploads/documents/1755525826092_Bonafide.pdf', 361514, '2025-08-18 14:03:46', NULL),
(31, 4, 'document', 'Report Format', 'The Training Report Format', '/uploads/documents/1755525848600_Format_summer_training_Report.pdf', 235289, '2025-08-18 14:04:08', NULL),
(32, 4, 'document', 'MO\'s CV', 'My CV-2025', '/uploads/documents/1755525897708_MY_CURRICULUM_VITAE.docx', 16970, '2025-08-18 14:04:57', NULL),
(33, 4, 'document', 'MO\'s Report', 'My Full report- eGAZ 2025', '/uploads/documents/1755525940374_Summer_Training_Report.docx', 167065, '2025-08-18 14:05:40', NULL),
(34, 4, 'document', 'Minor Project Synopsis', 'Our Synopsis for Minor Project- 4th sem', '/uploads/documents/1755526003755_Minor_Project_Synopsis.pdf', 434996, '2025-08-18 14:06:43', NULL),
(35, 4, 'document', 'YUVA- Offer Letter', 'Internship Offer Letter by YUVA', '/uploads/documents/1755526115011_offer-letter-_YUVA.pdf', 132238, '2025-08-18 14:08:35', NULL),
(36, 4, 'video', 'MO11\'s Farewell 2025', 'Italy Kids with Glorious Friends', '/uploads/videos/1755526177889_video.mp4', 9098592, '2025-08-18 14:09:38', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_file_name` (`file_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
