DROP TABLE IF EXISTS `kjd`;
CREATE TABLE `kjd` (
  `id` int(11) NOT NULL auto_increment,
  `parent` int(11) default NULL,
  `nodes` blob,
  `lt` int(11) default NULL,
  `rt` int(11) default NULL,
  PRIMARY KEY  (`id`),
  KEY `lt` (`lt`,`rt`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
