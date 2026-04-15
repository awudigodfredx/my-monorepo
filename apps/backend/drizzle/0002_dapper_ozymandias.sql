CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(100) NOT NULL,
	`url` varchar(2048) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`payload` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
