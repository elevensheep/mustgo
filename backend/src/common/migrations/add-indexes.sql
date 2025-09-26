-- 플레이리스트 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_place_groups_user_id ON place_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_place_groups_name ON place_groups(name);
CREATE INDEX IF NOT EXISTS idx_place_groups_created_at ON place_groups(created_at);

-- 맛집 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_places_place_id ON places(place_id);
CREATE INDEX IF NOT EXISTS idx_places_name ON places(name);
CREATE INDEX IF NOT EXISTS idx_places_user_id ON places(user_id);
CREATE INDEX IF NOT EXISTS idx_places_is_from_api ON places(is_from_api);
CREATE INDEX IF NOT EXISTS idx_places_location ON places(latitude, longitude);

-- 플레이리스트 아이템 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_place_group_items_group_id ON place_group_items(place_group_id);
CREATE INDEX IF NOT EXISTS idx_place_group_items_place_id ON place_group_items(place_id);

-- 사용자 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 댓글 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_place_id ON comments(place_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
