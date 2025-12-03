-- Homepage Sections Table
-- Stores the three main category sections displayed on the homepage

CREATE TABLE IF NOT EXISTS homepage_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(50) UNIQUE NOT NULL, -- 'collections', 'luxury', 'crocs'
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    product_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    gradient_color VARCHAR(100), -- CSS gradient class or color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (section_key),
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default sections
INSERT INTO homepage_sections (section_key, title, subtitle, description, link_url, product_count, display_order, gradient_color) VALUES
('collections', 'Rudy Collections', 'Premium fashion for every occasion', 'Discover our premium collection of fashion items', '/collections', 1200, 1, 'bg-gradient-to-br from-purple-500 to-pink-500'),
('luxury', 'Rudy Luxury', 'Exclusive luxury items and accessories', 'Explore our exclusive luxury collection', '/luxury', 800, 2, 'bg-gradient-to-br from-amber-500 to-orange-500'),
('crocs', 'Slide & Sole', 'Comfortable and stylish footwear', 'Find your perfect pair of comfortable footwear', '/crocs', 0, 3, 'bg-gradient-to-br from-green-500 to-teal-500')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    subtitle = VALUES(subtitle),
    description = VALUES(description),
    link_url = VALUES(link_url),
    product_count = VALUES(product_count),
    display_order = VALUES(display_order),
    gradient_color = VALUES(gradient_color);

