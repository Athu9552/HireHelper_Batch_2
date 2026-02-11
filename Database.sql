show databases;
create database authentication;
use authentication;
CREATE TABLE users (
id CHAR(36) PRIMARY KEY,
first_name VARCHAR(60) NOT NULL,
last_name VARCHAR(60) NOT NULL,
phone_number VARCHAR(20) NULL,
email_id VARCHAR(120) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
profile_picture VARCHAR(255) NULL,
is_verified TINYINT(1) NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE email_otps (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
user_id CHAR(36) NOT NULL,
otp_hash VARCHAR(255) NOT NULL,
purpose ENUM('register','login') NOT NULL,
expires_at DATETIME NOT NULL,
used_at DATETIME NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

