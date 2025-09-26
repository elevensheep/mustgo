-- 좌표 컬럼 타입을 double precision으로 변경하는 마이그레이션

-- place_groups 테이블의 latitude, longitude 컬럼 타입 변경
ALTER TABLE place_groups 
ALTER COLUMN latitude TYPE double precision,
ALTER COLUMN longitude TYPE double precision;

-- places 테이블의 latitude, longitude 컬럼 타입 변경
ALTER TABLE places 
ALTER COLUMN latitude TYPE double precision,
ALTER COLUMN longitude TYPE double precision;

-- distance 컬럼도 double precision으로 변경 (거리 계산에서 소수점이 필요할 수 있음)
ALTER TABLE places 
ALTER COLUMN distance TYPE double precision;

