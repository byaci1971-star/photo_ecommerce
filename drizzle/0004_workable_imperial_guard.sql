CREATE TABLE `calendarOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customProductId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`size` varchar(50) NOT NULL,
	`year` int NOT NULL,
	`language` varchar(10) NOT NULL,
	`pricePerCalendar` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `calendarOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`basePrice` int NOT NULL,
	`customizationOptions` text,
	`uploadedImages` text,
	`previewImage` varchar(512),
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `giftOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customProductId` int NOT NULL,
	`itemType` varchar(50) NOT NULL,
	`color` varchar(50) NOT NULL,
	`size` varchar(50),
	`material` varchar(50),
	`pricePerItem` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `giftOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photoBookOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customProductId` int NOT NULL,
	`size` varchar(50) NOT NULL,
	`pages` int NOT NULL,
	`cover` varchar(50) NOT NULL,
	`binding` varchar(50) NOT NULL,
	`pricePerBook` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photoBookOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photoPrintOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customProductId` int NOT NULL,
	`size` varchar(50) NOT NULL,
	`finish` varchar(50) NOT NULL,
	`quantity` int NOT NULL,
	`pricePerUnit` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photoPrintOptions_id` PRIMARY KEY(`id`)
);
