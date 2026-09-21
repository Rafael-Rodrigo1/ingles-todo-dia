ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users
    ADD COLUMN reset_password_token VARCHAR(255);

ALTER TABLE users
    ADD COLUMN reset_password_expiration TIMESTAMP;