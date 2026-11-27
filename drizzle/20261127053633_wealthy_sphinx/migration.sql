CREATE TABLE `tb_athletes` (
	`user_id` varchar(36) PRIMARY KEY,
	`coach_id` varchar(36) NOT NULL,
	`primary_sport` varchar(50) NOT NULL,
	`consent_status` boolean NOT NULL DEFAULT false,
	`radar_chart_data` json,
	`selection_status` boolean NOT NULL DEFAULT false,
	`registered_date` timestamp
);
--> statement-breakpoint
CREATE TABLE `tb_training_records` (
	`record_id` int AUTO_INCREMENT PRIMARY KEY,
	`athlete` varchar(36) NOT NULL,
	`coach_id` varchar(36) NOT NULL,
	`faci_id` int NOT NULL,
	`training_date` datetime NOT NULL,
	`start_time` time,
	`end_time` time,
	`attendance_status` boolean NOT NULL DEFAULT false,
	`fitness_score` decimal(12,2) NOT NULL DEFAULT (0),
	`effort_score` decimal(12,2) NOT NULL DEFAULT (0),
	`coach_notes` longtext
);
--> statement-breakpoint
CREATE TABLE `tb_budgets` (
	`budget_id` int AUTO_INCREMENT PRIMARY KEY,
	`fiscal_id` int NOT NULL,
	`allocated_amount` decimal(12,2) NOT NULL DEFAULT (0),
	`remaining_amout` decimal(12,2) NOT NULL DEFAULT (0)
);
--> statement-breakpoint
CREATE TABLE `tb_budgets_detail` (
	`detail_id` int AUTO_INCREMENT PRIMARY KEY,
	`budget_id` int NOT NULL,
	`create_by` varchar(36) NOT NULL,
	`Amount` decimal(12,2) NOT NULL DEFAULT (0),
	`Source` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tb_fiscal_years` (
	`fiscal_id` int AUTO_INCREMENT PRIMARY KEY,
	`years` varchar(4)
);
--> statement-breakpoint
CREATE TABLE `tb_bookings` (
	`booking_id` int AUTO_INCREMENT PRIMARY KEY,
	`user_id` varchar(36) NOT NULL,
	`facility_id` int NOT NULL,
	`booking_code` varchar(20) NOT NULL,
	`booking_date` timestamp,
	`booking_type` varchar(50) NOT NULL,
	`status` boolean NOT NULL DEFAULT false,
	`checkin_time` datetime NOT NULL,
	CONSTRAINT `booking_code_unique` UNIQUE INDEX(`booking_code`)
);
--> statement-breakpoint
CREATE TABLE `tb_facilties` (
	`facility_id` int AUTO_INCREMENT PRIMARY KEY,
	`sfaff_id` varchar(36) NOT NULL,
	`facility_name` varchar(255) NOT NULL,
	`sport_type` varchar(150) NOT NULL,
	`max_player` int DEFAULT 1,
	`open_time` datetime NOT NULL,
	`close_time` datetime NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	`update_at` timestamp
);
--> statement-breakpoint
CREATE TABLE `tb_budget_request_items` (
	`item_id` int AUTO_INCREMENT PRIMARY KEY,
	`request_id` int NOT NULL,
	`item_name` varchar(200) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`unit_price` decimal(10,2) NOT NULL DEFAULT (0),
	`total_price` decimal(10,2) NOT NULL DEFAULT (0)
);
--> statement-breakpoint
CREATE TABLE `tb_budget_requests` (
	`request_id` int AUTO_INCREMENT PRIMARY KEY,
	`budget_id` int NOT NULL,
	`requester_id` varchar(36) NOT NULL,
	`approved_by` varchar(36),
	`title` varchar(200) NOT NULL,
	`total_estimated_amount` decimal(10,2) NOT NULL DEFAULT (0),
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`actual_paid_amount` decimal(10,2),
	`approved_date` datetime,
	`created_at` datetime,
	`docs_url` varchar(500)
);
--> statement-breakpoint
CREATE TABLE `tb_repairs` (
	`repair_id` int AUTO_INCREMENT PRIMARY KEY,
	`reporter_id` varchar(36) NOT NULL,
	`facility_id` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`severity_level` varchar(20) NOT NULL DEFAULT 'MEDIUM',
	`is_petty_cash` boolean NOT NULL DEFAULT true,
	`budget_request_id` int,
	`actual_cost` decimal(10,2) NOT NULL DEFAULT (0),
	`image_url` varchar(500),
	`status` varchar(20) NOT NULL DEFAULT 'REPORTED',
	`created_at` datetime NOT NULL,
	`completed_at` datetime
);
--> statement-breakpoint
CREATE TABLE `tb_users` (
	`user_id` varchar(36) PRIMARY KEY,
	`username` varchar(50) NOT NULL,
	`password` varchar(255) NOT NULL,
	`full_name` varchar(150) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	`role` enum('staff','coach','user','admin') NOT NULL DEFAULT 'user',
	`created_at` timestamp,
	CONSTRAINT `username_unique` UNIQUE INDEX(`username`),
	CONSTRAINT `phone_number_unique` UNIQUE INDEX(`phone_number`)
);
--> statement-breakpoint
ALTER TABLE `tb_athletes` ADD CONSTRAINT `tb_athletes_user_id_tb_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tb_users`(`user_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_athletes` ADD CONSTRAINT `tb_athletes_coach_id_tb_users_user_id_fkey` FOREIGN KEY (`coach_id`) REFERENCES `tb_users`(`user_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_training_records` ADD CONSTRAINT `tb_training_records_athlete_tb_athletes_user_id_fkey` FOREIGN KEY (`athlete`) REFERENCES `tb_athletes`(`user_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_training_records` ADD CONSTRAINT `tb_training_records_coach_id_tb_users_user_id_fkey` FOREIGN KEY (`coach_id`) REFERENCES `tb_users`(`user_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_training_records` ADD CONSTRAINT `tb_training_records_faci_id_tb_facilties_facility_id_fkey` FOREIGN KEY (`faci_id`) REFERENCES `tb_facilties`(`facility_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_budgets` ADD CONSTRAINT `tb_budgets_fiscal_id_tb_fiscal_years_fiscal_id_fkey` FOREIGN KEY (`fiscal_id`) REFERENCES `tb_fiscal_years`(`fiscal_id`) ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_budgets_detail` ADD CONSTRAINT `tb_budgets_detail_budget_id_tb_budgets_budget_id_fkey` FOREIGN KEY (`budget_id`) REFERENCES `tb_budgets`(`budget_id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_budgets_detail` ADD CONSTRAINT `tb_budgets_detail_create_by_tb_users_user_id_fkey` FOREIGN KEY (`create_by`) REFERENCES `tb_users`(`user_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_bookings` ADD CONSTRAINT `tb_bookings_user_id_tb_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tb_users`(`user_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_bookings` ADD CONSTRAINT `tb_bookings_facility_id_tb_facilties_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `tb_facilties`(`facility_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_facilties` ADD CONSTRAINT `tb_facilties_sfaff_id_tb_users_user_id_fkey` FOREIGN KEY (`sfaff_id`) REFERENCES `tb_users`(`user_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_budget_request_items` ADD CONSTRAINT `tb_budget_request_items_Xd10vnLBW1zv_fkey` FOREIGN KEY (`request_id`) REFERENCES `tb_budget_requests`(`request_id`) ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_budget_requests` ADD CONSTRAINT `tb_budget_requests_budget_id_tb_budgets_budget_id_fkey` FOREIGN KEY (`budget_id`) REFERENCES `tb_budgets`(`budget_id`) ON DELETE RESTRICT ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE `tb_budget_requests` ADD CONSTRAINT `tb_budget_requests_requester_id_tb_users_user_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `tb_users`(`user_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_budget_requests` ADD CONSTRAINT `tb_budget_requests_approved_by_tb_users_user_id_fkey` FOREIGN KEY (`approved_by`) REFERENCES `tb_users`(`user_id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `tb_repairs` ADD CONSTRAINT `tb_repairs_reporter_id_tb_users_user_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `tb_users`(`user_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_repairs` ADD CONSTRAINT `tb_repairs_facility_id_tb_facilties_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `tb_facilties`(`facility_id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `tb_repairs` ADD CONSTRAINT `tb_repairs_budget_request_id_tb_budget_requests_request_id_fkey` FOREIGN KEY (`budget_request_id`) REFERENCES `tb_budget_requests`(`request_id`) ON DELETE SET NULL;