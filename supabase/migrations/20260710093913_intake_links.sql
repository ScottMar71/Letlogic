-- Applicant intake links: shareable forms applicants fill in themselves.
-- The landlord creates a link (no credit spent), the applicant submits the
-- structured form on the public /apply/[token] page, and the landlord reviews
-- and runs the screening — the credit is spent at that point via the existing
-- analyse flow.

create table public.intake_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  -- Set once the landlord runs the screening from the submission.
  application_id uuid references public.applications (id) on delete set null,
  -- Unguessable URL token (32 hex chars, generated server-side).
  token text not null unique,
  applicant_name text,
  status text not null default 'pending'
    check (status in ('pending', 'submitted', 'screened', 'cancelled')),
  -- Applicant's answers, validated against intakeSubmissionSchema.
  submitted_data jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  submitted_at timestamptz
);

create index intake_links_user_id_idx on public.intake_links (user_id);

alter table public.intake_links enable row level security;

-- Owner read only. All writes — including the anonymous applicant submission —
-- go through the admin client in server actions, matching applications/assessments.
create policy "Users can view own intake links"
  on public.intake_links for select
  using (auth.uid() = user_id);
