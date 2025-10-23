-- Create tables for the application

CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    profile_picture_url VARCHAR,
    location VARCHAR,
    interests VARCHAR,
    sustainability_goals VARCHAR,
    created_at VARCHAR NOT NULL,
    privacy_settings VARCHAR
);

CREATE TABLE carbon_footprint_entries (
    entry_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    travel NUMERIC,
    diet NUMERIC,
    energy_use NUMERIC,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE community_forum_threads (
    thread_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE community_forum_comments (
    comment_id VARCHAR PRIMARY KEY,
    thread_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (thread_id) REFERENCES community_forum_threads(thread_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE educational_resources (
    resource_id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    content_url VARCHAR NOT NULL,
    content_type VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE eco_shop_products (
    product_id VARCHAR PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    vendor VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    price NUMERIC NOT NULL,
    rating NUMERIC,
    created_at VARCHAR NOT NULL
);

CREATE TABLE product_reviews (
    review_id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    rating NUMERIC NOT NULL,
    review VARCHAR,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (product_id) REFERENCES eco_shop_products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE sustainability_challenges (
    challenge_id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    duration VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE challenge_participation (
    participation_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    challenge_id VARCHAR NOT NULL,
    progress VARCHAR,
    rewards VARCHAR,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (challenge_id) REFERENCES sustainability_challenges(challenge_id)
);

CREATE TABLE partnerships (
    partnership_id VARCHAR PRIMARY KEY,
    organization_name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    contact_email VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE collaborations (
    collaboration_id VARCHAR PRIMARY KEY,
    partnership_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (partnership_id) REFERENCES partnerships(partnership_id)
);

-- Seed data for testing

INSERT INTO users (user_id, email, name, password_hash, profile_picture_url, location, interests, sustainability_goals, created_at, privacy_settings) VALUES
('user1', 'user1@example.com', 'Alice Smith', 'password123', 'https://picsum.photos/seed/picsum1/200', 'New York', 'cycling', 'reduce plastic use', '2023-10-01', 'private'),
('user2', 'user2@example.com', 'Bob Johnson', 'admin123', 'https://picsum.photos/seed/picsum2/200', 'California', 'hiking, reading', 'support renewable energy', '2023-10-02', 'friends only'),
('user3', 'user3@example.com', 'Charlie Brown', 'user123', 'https://picsum.photos/seed/picsum3/200', 'Texas', 'gardening', 'zero waste', '2023-10-03', 'public');

INSERT INTO carbon_footprint_entries (entry_id, user_id, travel, diet, energy_use, created_at) VALUES
('entry1', 'user1', 20.5, 30.2, 45.8, '2023-10-05'),
('entry2', 'user2', 15.0, 20.0, 25.0, '2023-10-06'),
('entry3', 'user3', 10.5, 25.5, 35.5, '2023-10-07');

INSERT INTO community_forum_threads (thread_id, user_id, title, content, created_at) VALUES
('thread1', 'user1', 'How to reduce plastic?', 'Anyone have tips on reducing plastic waste?', '2023-10-05'),
('thread2', 'user2', 'Best eco-friendly products', 'Share your favorite eco-friendly products here.', '2023-10-06');

INSERT INTO community_forum_comments (comment_id, thread_id, user_id, content, created_at) VALUES
('comment1', 'thread1', 'user2', 'I recommend using reusable bags.', '2023-10-07'),
('comment2', 'thread2', 'user3', 'I love bamboo toothbrushes!', '2023-10-08');

INSERT INTO educational_resources (resource_id, title, content_url, content_type, topic, created_at) VALUES
('resource1', 'Sustainable Living 101', 'https://example.com/resource1', 'video', 'sustainability', '2023-09-30'),
('resource2', 'Eco Tips', 'https://example.com/resource2', 'article', 'environment', '2023-10-01');

INSERT INTO eco_shop_products (product_id, product_name, vendor, description, price, rating, created_at) VALUES
('product1', 'Reusable Water Bottle', 'Green Supplies', 'Durable and eco-friendly water bottle.', 19.99, 4.5, '2023-10-01'),
('product2', 'Organic Cotton Tote Bag', 'Eco Fashion', 'Stylish and sustainable tote bag.', 24.99, 4.7, '2023-10-02');

INSERT INTO product_reviews (review_id, product_id, user_id, rating, review, created_at) VALUES
('review1', 'product1', 'user1', 5, 'Great bottle!', '2023-10-03'),
('review2', 'product1', 'user2', 4, 'Very useful but pricey.', '2023-10-04');

INSERT INTO sustainability_challenges (challenge_id, title, description, duration, created_at) VALUES
('challenge1', 'Plastic-Free Week', 'Avoid using any plastic products for a week.', '7 days', '2023-10-01'),
('challenge2', 'Green Commute Month', 'Use eco-friendly transportation for a month.', '30 days', '2023-10-02');

INSERT INTO challenge_participation (participation_id, user_id, challenge_id, progress, rewards, created_at) VALUES
('participation1', 'user1', 'challenge1', 'Completed 5 days', 'Plant a tree', '2023-10-05'),
('participation2', 'user2', 'challenge2', 'Completed 15 days', 'Free eco workshop', '2023-10-06');

INSERT INTO partnerships (partnership_id, organization_name, description, contact_email, created_at) VALUES
('partnership1', 'Eco Foundation', 'Partnership for promoting sustainable practices.', 'contact@ecofoundation.org', '2023-10-01'),
('partnership2', 'Green Earth', 'Collaboration for environmental projects.', 'contact@greenearth.com', '2023-10-02');

INSERT INTO collaborations (collaboration_id, partnership_id, title, description, created_at) VALUES
('collaboration1', 'partnership1', 'Community Clean-Up', 'Organize community events to clean local parks.', '2023-10-05'),
('collaboration2', 'partnership2', 'Recycling Initiative', 'Promote recycling through awareness programs.', '2023-10-06');