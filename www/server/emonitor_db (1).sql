-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2017 at 08:14 AM
-- Server version: 5.5.27
-- PHP Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `emonitor_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_envi`
--

CREATE TABLE IF NOT EXISTS `tbl_envi` (
  `envi_id` int(11) NOT NULL AUTO_INCREMENT,
  `envi_subdate` date NOT NULL,
  `envi_weekno` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `farms_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `operations_id` int(11) NOT NULL,
  `envi_findings` mediumtext NOT NULL,
  PRIMARY KEY (`envi_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tbl_envi`
--

INSERT INTO `tbl_envi` (`envi_id`, `envi_subdate`, `envi_weekno`, `user_id`, `farms_id`, `location_id`, `operations_id`, `envi_findings`) VALUES
(1, '2017-03-07', 10, 5, 2, 2, 1, 'Say Hi Janna Claire Say Hi Janna Claire Say Hi Janna Claire Say Hi Janna Claire Say Hi Janna Claire Say Hi Janna Claire Say Hi Janna Claire '),
(2, '2017-03-07', 10, 5, 2, 2, 2, 'ggg');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_envi_findings_criteria`
--

CREATE TABLE IF NOT EXISTS `tbl_envi_findings_criteria` (
  `ecrit_id` int(11) NOT NULL AUTO_INCREMENT,
  `ecrit_desc` varchar(50) NOT NULL,
  PRIMARY KEY (`ecrit_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `tbl_envi_findings_criteria`
--

INSERT INTO `tbl_envi_findings_criteria` (`ecrit_id`, `ecrit_desc`) VALUES
(1, 'Social Environment & Mgt. System'),
(2, 'Ecosystem Conservation'),
(3, 'Wildlife Conservation'),
(4, 'Water Conservation'),
(5, 'Fair Treatment and Good Working Condition'),
(6, 'Occupational Health and Safety'),
(7, 'Community Relations'),
(8, 'Integrated Crop Management'),
(9, 'Soil Conservation'),
(10, ' Integrated Waste Management '),
(11, 'Food Safety'),
(12, 'Other Findings');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_envi_scoring`
--

CREATE TABLE IF NOT EXISTS `tbl_envi_scoring` (
  `envi_id` int(11) NOT NULL,
  `envi_score` int(11) DEFAULT NULL,
  `ecrit_id` int(11) NOT NULL,
  `envi_rate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_envi_scoring`
--

INSERT INTO `tbl_envi_scoring` (`envi_id`, `envi_score`, `ecrit_id`, `envi_rate`) VALUES
(1, 0, 0, 'No'),
(2, 0, 0, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_farms`
--

CREATE TABLE IF NOT EXISTS `tbl_farms` (
  `farms_id` int(11) NOT NULL AUTO_INCREMENT,
  `farms_desc` varchar(50) NOT NULL,
  PRIMARY KEY (`farms_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `tbl_farms`
--

INSERT INTO `tbl_farms` (`farms_id`, `farms_desc`) VALUES
(1, 'TVPI'),
(2, 'MKAVI'),
(3, 'MKAVI - II'),
(4, 'MADC');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_location`
--

CREATE TABLE IF NOT EXISTS `tbl_location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_desc` varchar(30) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tbl_location`
--

INSERT INTO `tbl_location` (`location_id`, `location_desc`) VALUES
(1, 'Packing House'),
(2, 'Chemical Mixing Area');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_operations`
--

CREATE TABLE IF NOT EXISTS `tbl_operations` (
  `operations_id` int(11) NOT NULL AUTO_INCREMENT,
  `operations_desc` varchar(20) NOT NULL,
  PRIMARY KEY (`operations_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tbl_operations`
--

INSERT INTO `tbl_operations` (`operations_id`, `operations_desc`) VALUES
(1, 'Packing'),
(2, 'Sigatoka');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_position`
--

CREATE TABLE IF NOT EXISTS `tbl_position` (
  `position_id` int(11) NOT NULL AUTO_INCREMENT,
  `position_desc` varchar(30) NOT NULL,
  PRIMARY KEY (`position_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `tbl_position`
--

INSERT INTO `tbl_position` (`position_id`, `position_desc`) VALUES
(1, 'Administrator'),
(2, 'Staff'),
(3, 'Manager');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pti`
--

CREATE TABLE IF NOT EXISTS `tbl_pti` (
  `PTI_id` int(11) NOT NULL AUTO_INCREMENT,
  `PTI_desc` varchar(30) NOT NULL,
  PRIMARY KEY (`PTI_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tbl_pti`
--

INSERT INTO `tbl_pti` (`PTI_id`, `PTI_desc`) VALUES
(1, 'Services1'),
(2, 'Services2');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE IF NOT EXISTS `tbl_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_fname` varchar(50) NOT NULL,
  `user_lname` varchar(50) NOT NULL,
  `farms_id` int(11) NOT NULL,
  `position_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`user_id`, `user_fname`, `user_lname`, `farms_id`, `position_id`) VALUES
(1, 'Patrick', 'Nengasca', 1, 2),
(2, 'James', 'Rod', 1, 3),
(3, 'ronel', 'roche', 3, 1),
(4, 'wew', 'wow', 4, 2),
(5, 'shit', 'yowo', 2, 2),
(6, 'samok', 'kaayo', 2, 2),
(7, 'samok', 'kaayo', 2, 2),
(8, 'Patrick james', 'Nengasca', 2, 1),
(9, 'Long', 'Long', 3, 2),
(10, 'Pota', 'Yawa', 4, 2),
(11, 'gdfg', 'dfgdg', 4, 2),
(12, 'xcvxcv', 'xcvcxv', 2, 3),
(13, 'dasd', 'dasd', 4, 2),
(14, 'asbvb', 'bvb', 2, 2),
(15, 'gfgf', 'gfgfgf', 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_account`
--

CREATE TABLE IF NOT EXISTS `tbl_user_account` (
  `user_id` int(11) NOT NULL,
  `ua_username` varchar(50) NOT NULL,
  `ua_password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user_account`
--

INSERT INTO `tbl_user_account` (`user_id`, `ua_username`, `ua_password`) VALUES
(1, 'pat', '123'),
(2, '123', '123'),
(3, 'ronel', 'ronel'),
(4, 'hahaha', 'hihihi'),
(5, 'wew', 'wew'),
(6, 'john', 'w'),
(7, 'john', 'w'),
(8, 'Patrick', 'Cute'),
(9, 'Long', 'Long'),
(10, 'Looy', 'Sad'),
(11, 'gdfg', 'gdfg'),
(12, 'vxcv', 'xcvcxv'),
(13, 'dad', 'asdasd'),
(14, 'bvbvb', 'vbvbv'),
(15, 'gfgfg', 'fgfgfg');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_login`
--
CREATE TABLE IF NOT EXISTS `view_login` (
`user_id` int(11)
,`user_fname` varchar(50)
,`farms_id` int(11)
,`user_lname` varchar(50)
,`ua_username` varchar(50)
,`ua_password` varchar(50)
,`farms_desc` varchar(50)
,`position_desc` varchar(30)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `view_report`
--
CREATE TABLE IF NOT EXISTS `view_report` (
`envi_id` int(11)
,`envi_subdate` date
,`envi_weekno` int(11)
,`user_fname` varchar(50)
,`user_lname` varchar(50)
,`farms_desc` varchar(50)
,`location_desc` varchar(30)
,`operations_desc` varchar(20)
,`envi_findings` mediumtext
,`envi_score` int(11)
,`envi_rate` varchar(10)
);
-- --------------------------------------------------------

--
-- Structure for view `view_login`
--
DROP TABLE IF EXISTS `view_login`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_login` AS select `a`.`user_id` AS `user_id`,`a`.`user_fname` AS `user_fname`,`a`.`farms_id` AS `farms_id`,`a`.`user_lname` AS `user_lname`,`d`.`ua_username` AS `ua_username`,`d`.`ua_password` AS `ua_password`,`b`.`farms_desc` AS `farms_desc`,`c`.`position_desc` AS `position_desc` from (((`tbl_user` `a` join `tbl_farms` `b` on((`a`.`farms_id` = `b`.`farms_id`))) join `tbl_position` `c` on((`a`.`position_id` = `c`.`position_id`))) join `tbl_user_account` `d` on((`a`.`user_id` = `d`.`user_id`)));

-- --------------------------------------------------------

--
-- Structure for view `view_report`
--
DROP TABLE IF EXISTS `view_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_report` AS select `a`.`envi_id` AS `envi_id`,`a`.`envi_subdate` AS `envi_subdate`,`a`.`envi_weekno` AS `envi_weekno`,`b`.`user_fname` AS `user_fname`,`b`.`user_lname` AS `user_lname`,`c`.`farms_desc` AS `farms_desc`,`d`.`location_desc` AS `location_desc`,`e`.`operations_desc` AS `operations_desc`,`a`.`envi_findings` AS `envi_findings`,`f`.`envi_score` AS `envi_score`,`f`.`envi_rate` AS `envi_rate` from (((((`tbl_envi` `a` join `tbl_user` `b` on((`a`.`user_id` = `b`.`user_id`))) join `tbl_farms` `c` on((`a`.`farms_id` = `c`.`farms_id`))) join `tbl_location` `d` on((`a`.`location_id` = `d`.`location_id`))) join `tbl_operations` `e` on((`a`.`operations_id` = `e`.`operations_id`))) join `tbl_envi_scoring` `f` on((`a`.`envi_id` = `f`.`envi_id`)));

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
