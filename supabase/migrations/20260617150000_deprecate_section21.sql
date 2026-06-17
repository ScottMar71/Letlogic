-- Deprecate Section 21 (and other legacy document types).
-- LetLogic has pivoted to tenant screening. Document tables are retained for
-- historical purchases, but the document types are deactivated so they no
-- longer appear anywhere in the product.

update public.document_types set active = false;
