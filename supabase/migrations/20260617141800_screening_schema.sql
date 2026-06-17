-- LetLogic tenant screening schema
-- Adds applicant intake, AI assessments, and a credit ledger for paid screenings.
-- Reuses existing profiles + properties tables.

-- applications: applicant input + deterministic pre-LLM metrics
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  applicant_name text not null,
  input_mode text not null default 'paste' check (input_mode in ('paste', 'form')),
  raw_text text,
  structured_data jsonb,
  monthly_income numeric(10, 2),
  income_multiple numeric(5, 2),
  job_stability_score int check (job_stability_score between 0 and 10),
  tenancy_stability_score int check (tenancy_stability_score between 0 and 10),
  created_at timestamptz not null default now()
);

create index applications_user_id_idx on public.applications (user_id);
create index applications_property_id_idx on public.applications (property_id);

-- assessments: LLM output (one application may have many, to keep re-analyse history)
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  risk_score int not null check (risk_score between 0 and 100),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  recommendation text not null check (recommendation in (
    'proceed', 'proceed_with_conditions', 'do_not_proceed'
  )),
  summary text not null,
  pros jsonb not null default '[]'::jsonb,
  cons jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  suggested_questions jsonb not null default '[]'::jsonb,
  data_gaps jsonb not null default '[]'::jsonb,
  prompt_version text not null default 'v1',
  model text not null,
  credit_ledger_id uuid,
  created_at timestamptz not null default now()
);

create index assessments_application_id_idx on public.assessments (application_id);
create index assessments_user_id_idx on public.assessments (user_id);

-- credit_ledger: append-only source of truth for credit entitlement.
-- Balance = sum(delta) per user. +N on purchase, -1 on spend, +1 on refund.
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  delta int not null,
  reason text not null check (reason in (
    'purchase', 'screening_spend', 'screening_refund', 'pro_grant', 'adjustment'
  )),
  purchase_id uuid references public.purchases (id) on delete set null,
  assessment_id uuid references public.assessments (id) on delete set null,
  created_at timestamptz not null default now()
);

create index credit_ledger_user_id_idx on public.credit_ledger (user_id);

-- link an assessment back to the ledger row that paid for it
alter table public.assessments
  add constraint assessments_credit_ledger_id_fkey
  foreign key (credit_ledger_id) references public.credit_ledger (id) on delete set null;

-- spend_credit: atomically debit one credit if balance allows.
-- Returns the inserted ledger row id on success, null when insufficient balance.
-- security definer so it can read/write the ledger regardless of the caller's RLS.
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

-- RLS
alter table public.applications enable row level security;
alter table public.assessments enable row level security;
alter table public.credit_ledger enable row level security;

-- applications (owner read; writes go through admin client in server actions)
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

-- assessments (owner read only)
create policy "Users can view own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

-- credit_ledger (owner read only; mutations via admin client / RPC)
create policy "Users can view own credit ledger"
  on public.credit_ledger for select
  using (auth.uid() = user_id);

-- seed screening credit packs into document_types-style reference is unnecessary;
-- pricing lives in application config (src/lib/screening/pricing.ts).
