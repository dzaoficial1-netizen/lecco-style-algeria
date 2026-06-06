
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten guest order insert: require minimum field lengths to prevent obvious junk
DROP POLICY "guests can place orders" ON public.orders;
CREATE POLICY "guests can place orders" ON public.orders FOR INSERT WITH CHECK (
  length(customer_name) BETWEEN 2 AND 120
  AND length(customer_phone) BETWEEN 6 AND 30
  AND length(address) BETWEEN 5 AND 500
  AND jsonb_typeof(items) = 'array'
  AND jsonb_array_length(items) BETWEEN 1 AND 100
  AND total >= 0
);
