-- =============================================
-- Add JSONB columns for work experience and portfolio
-- =============================================

-- Add work experience column to freelancer_profiles
-- Stores an array of experience objects as JSONB
ALTER TABLE freelancer_profiles
ADD COLUMN work_experience JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN freelancer_profiles.work_experience IS 'Array of work experience objects with fields: position, company, period, description';

-- Example structure:
-- [
--   {
--     "position": "Senior AI Engineer",
--     "company": "Tech Corp",
--     "period": "2020 - Present",
--     "description": "Led AI initiatives..."
--   }
-- ]

-- Add portfolio column to freelancer_profiles
-- Stores an array of portfolio items as JSONB
ALTER TABLE freelancer_profiles
ADD COLUMN portfolio JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN freelancer_profiles.portfolio IS 'Array of portfolio objects with fields: id, title, description, tags, imageUrl, url';

-- Example structure:
-- [
--   {
--     "id": "uuid-here",
--     "title": "AI Chatbot Platform",
--     "description": "Built a conversational AI platform...",
--     "tags": ["AI", "NLP", "Python"],
--     "imageUrl": "https://...",
--     "url": "https://project-demo.com"
--   }
-- ]

-- =============================================
-- Migrate existing portfolio data to new JSONB column
-- =============================================

-- Migrate existing single portfolio item to portfolio array
-- Only migrate if the old fields have data
UPDATE freelancer_profiles
SET portfolio = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'title', portfolio_title,
    'description', portfolio_description,
    'tags', portfolio_tags,
    'imageUrl', portfolio_image,
    'url', null
  )
)
WHERE portfolio_title IS NOT NULL AND portfolio_title != '';

-- =============================================
-- Note: Keep old portfolio columns for backward compatibility
-- They can be removed in a future migration once all code is updated
-- =============================================
