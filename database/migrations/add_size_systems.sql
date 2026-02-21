-- Add Clothing Sizes table
CREATE TABLE IF NOT EXISTS clothing_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add Shoe Sizes table
CREATE TABLE IF NOT EXISTS shoe_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    size VARCHAR(20) NOT NULL,
    system ENUM('EU', 'UK', 'USA', 'Other') NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_shoe_size (size, system)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default clothing sizes
INSERT IGNORE INTO clothing_sizes (name, display_order) VALUES 
('XS', 1), ('S', 2), ('M', 3), ('L', 4), ('XL', 5), ('XXL', 6), ('XXXL', 7);

-- Insert some default shoe sizes
INSERT IGNORE INTO shoe_sizes (size, system, display_order) VALUES 
('38', 'EU', 1), ('39', 'EU', 2), ('40', 'EU', 3), ('41', 'EU', 4), ('42', 'EU', 5), ('43', 'EU', 6), ('44', 'EU', 7), ('45', 'EU', 8),
('6', 'UK', 1), ('7', 'UK', 2), ('8', 'UK', 3), ('9', 'UK', 4), ('10', 'UK', 5), ('11', 'UK', 6),
('7', 'USA', 1), ('8', 'USA', 2), ('9', 'USA', 3), ('10', 'USA', 4), ('11', 'USA', 5), ('12', 'USA', 6);
