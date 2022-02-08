CREATE TABLE account_info (
	account_info_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(225),
    PRIMARY KEY (account_info_id)
);

CREATE TABLE rating_info (
	rating_info_id INT NOT NULL AUTO_INCREMENT,
    account_info_id INT,
    video_info_id INT,
	is_liked BOOLEAN,
    is_disliked BOOLEAN,
    is_misinformation BOOLEAN,
    is_did_not_work BOOLEAN,
    is_outdated BOOLEAN,
    is_offensive BOOLEAN,
    is_immoral BOOLEAN,
    PRIMARY KEY (rating_info_id),
    CONSTRAINT 	`fk_account_info_id`
		FOREIGN KEY (`account_info_id`)
        REFERENCES `sweng894`.`account_info` (`account_info_id`) ON DELETE CASCADE,
	CONSTRAINT 	`fk_video_info_id`
		FOREIGN KEY (`video_info_id`)
        REFERENCES `sweng894`.`video_info` (`video_info_id`) ON DELETE CASCADE
);

CREATE TABLE video_info (
	video_info_id INT NOT NULL AUTO_INCREMENT,
    video_url VARCHAR(255),
    PRIMARY KEY (video_info_id)
);

SELECT video_info_id FROM video_info WHERE video_url = 'https://www.youtube.com/watch?v=mid-aQ78y1s';
INSERT INTO video_info (video_url) VALUES ('https://www.youtube.com/watch?v=mid-aQ78y1s');

SELECT account_info_id FROM account_info WHERE username = 'MATTHEW BEAUDREAULT';
INSERT INTO account_info (username) VALUES ('MATTHEW BEAUDREAULT');

INSERT INTO rating_info (
	account_info_id,
    video_info_id,
	is_liked,
    is_disliked,
    is_misinformation,
    is_did_not_work,
    is_outdated,
    is_offensive,
    is_immoral) VALUES (
    1,
    1,
    true,
    false,
    true,
    true,
    true,
    true,
    true
    );
    
SELECT SUM(is_liked), SUM(is_disliked) FROM rating_info WHERE video_info_id = 1 AND account_info_id = 1;