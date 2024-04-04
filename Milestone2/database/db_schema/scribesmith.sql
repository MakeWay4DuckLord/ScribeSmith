/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/* i don't know why those ^ are here... but i left them in */

CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usr_email` varchar(90) NOT NULL,
  `usr_first_name` varchar(20) NOT NULL,
  `usr_last_name` varchar(20),
  `usr_password` char(128) NOT NULL,
  `usr_salt` char(67) NOT NULL,
  `usr_icon` varchar(500),
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `campaign` (
  `cpn_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cpn_owner_id` int(10) unsigned NOT NULL,
  `cpn_name` varchar(50) NOT NULL,
  `cpn_banner` varchar(500),
  `cpn_description` varchar(1200),
  `cpn_join_code` char(5),
  PRIMARY KEY (`cpn_id`),
  CONSTRAINT `FK_CPN_USR` FOREIGN KEY (`cpn_owner_id`) REFERENCES user(`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `note` (
  `note_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `note_owner_id` int(10) unsigned NOT NULL,
  `note_campaign_id` int(10) unsigned NOT NULL,
  `note_title` varchar(60) NOT NULL,
  `note_text` varchar(Max),
  PRIMARY KEY (`note_id`),
  CONSTRAINT `FK_NOTE_USR` FOREIGN KEY (`note_owner_id`) REFERENCES user(`usr_id`),
  CONSTRAINT `FK_NOTE_CPN` FOREIGN KEY (`note_campaign_id`) REFERENCES campaign(`cpn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tag` (
  `tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tag_text` varchar(60) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;