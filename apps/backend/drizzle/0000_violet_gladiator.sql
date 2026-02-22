CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
