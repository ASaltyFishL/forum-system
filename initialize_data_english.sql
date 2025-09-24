USE forum;

-- Insert category
INSERT INTO category (name, description, create_time, update_time)
VALUES ('Tech', 'Technical blogs', NOW(), NOW());

-- Get category ID
SET @categoryId = (SELECT id FROM category WHERE name = 'Tech');

-- Insert blog
INSERT INTO blog (title, content, summary, category_id, user_id, view_count, comment_count, published, create_time, update_time)
VALUES (
    'Spring Boot Tutorial',
    'Spring Boot is a popular framework for building Java applications quickly and easily.',
    'Introduction to Spring Boot development',
    @categoryId,
    1,
    0,
    0,
    TRUE,
    NOW(),
    NOW()
);

-- Insert one more blog
INSERT INTO blog (title, content, summary, category_id, user_id, view_count, comment_count, published, create_time, update_time)
VALUES (
    'Java Programming Tips',
    'Useful tips and tricks for Java developers.',
    'Helpful advice for Java programmers',
    @categoryId,
    1,
    0,
    0,
    TRUE,
    NOW(),
    NOW()
);

SELECT 'Data inserted successfully!';