DROP TABLE IF EXISTS `kjd`;
CREATE TABLE `kjd` (
  `id` int(11) NOT NULL,
  `parent` int(11) default NULL,
  `properties` blob,
  `lt` int(11) default NULL,
  `rt` int(11) default NULL,
  `depth` int(11) default NULL,
  PRIMARY KEY  (`id`),
  KEY `lt` (`lt`,`rt`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
alter table kjd add index parent (parent);