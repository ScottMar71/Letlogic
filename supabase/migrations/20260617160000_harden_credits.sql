-- Harden credit RPCs: row locking, service-role-only access, invoice idempotency.

alter table public.credit_ledger
  add column if not exists stripe_invoice_id text;

create unique index if not exists credit_ledger_stripe_invoice_id_unique
  on public.credit_ledger (stripe_invoice_id)
  where stripe_invoice_id is not null;

-- Atomic debit with per-user advisory lock to prevent concurrent double-spend.
create or replace function public.spend_credit(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance int;
  v_ledger_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select coalesce(sum(delta), 0) into v_balance
  from credit_ledger
  where user_id = p_user_id;

  if v_balance < 1 then
    return null;
  end if;

  insert into credit_ledger (user_id, delta, reason)
  values (p_user_id, -1, 'screening_spend')
  returning id into v_ledger_id;

  return v_ledger_id;
end;
$$;

create or replace function public.get_credit_balance(p_user_id uuid)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(delta), 0)::int
  from credit_ledger
  where user_id = p_user_id;
$$;

revoke all on function public.spend_credit(uuid) from public;
revoke all on function public.spend_credit(uuid) from anon;
revoke all on function public.spend_credit(uuid) from authenticated;
grant execute on function public.spend_credit(uuid) to service_role;

revoke all on function public.get_credit_balance(uuid) from public;
revoke all on function public.get_credit_balance(uuid) from anon;
revoke all on function public.get_credit_balance(uuid) from authenticated;
grant execute on function public.get_credit_balance(uuid) to service_role;
