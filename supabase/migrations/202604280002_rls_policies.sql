create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_admin_or_moderator()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'moderator')
$$;

create or replace function public.is_household_owner(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.households h
    where h.id = target_household_id
      and h.created_by_profile_id = public.current_profile_id()
  )
$$;

create or replace function public.is_proposal_host(target_proposal_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.meetup_proposals mp
    join public.households h on h.id = mp.host_household_id
    where mp.id = target_proposal_id
      and h.created_by_profile_id = public.current_profile_id()
  )
$$;

create or replace function public.has_approved_rsvp(
  target_proposal_id uuid,
  target_household_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.rsvps r
    where r.proposal_id = target_proposal_id
      and r.status in ('approved', 'attended')
      and (
        target_household_id is null
        or r.household_id = target_household_id
      )
      and public.is_household_owner(r.household_id)
  )
$$;

create or replace function public.is_publicly_discoverable_proposal(target_proposal_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.meetup_proposals mp
    where mp.id = target_proposal_id
      and mp.visibility = 'local_public'
      and mp.manual_review_status = 'approved'
      and mp.status in ('interest_open', 'finalizing', 'rsvp_open', 'confirmed')
  )
$$;

create or replace function public.shares_approved_proposal_with_household(
  target_household_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.rsvps viewer_rsvp
    join public.rsvps target_rsvp
      on target_rsvp.proposal_id = viewer_rsvp.proposal_id
    where target_rsvp.household_id = target_household_id
      and target_rsvp.status in ('approved', 'attended')
      and viewer_rsvp.status in ('approved', 'attended')
      and public.is_household_owner(viewer_rsvp.household_id)
  )
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.meetup_proposals enable row level security;
alter table public.proposal_options enable row level security;
alter table public.interest_responses enable row level security;
alter table public.interest_response_options enable row level security;
alter table public.rsvps enable row level security;
alter table public.event_messages enable row level security;
alter table public.reconnect_interests enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (auth_user_id = auth.uid() or public.is_admin_or_moderator());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth_user_id = auth.uid());

create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (auth_user_id = auth.uid() or public.is_admin_or_moderator())
with check (auth_user_id = auth.uid() or public.is_admin_or_moderator());

create policy "households_select_related_or_admin"
on public.households
for select
to authenticated
using (
  public.is_household_owner(id)
  or public.is_admin_or_moderator()
  or public.shares_approved_proposal_with_household(id)
);

create policy "households_insert_own"
on public.households
for insert
to authenticated
with check (created_by_profile_id = public.current_profile_id());

create policy "households_update_own_or_admin"
on public.households
for update
to authenticated
using (public.is_household_owner(id) or public.is_admin_or_moderator())
with check (public.is_household_owner(id) or public.is_admin_or_moderator());

create policy "households_delete_own_or_admin"
on public.households
for delete
to authenticated
using (public.is_household_owner(id) or public.is_admin_or_moderator());

create policy "household_members_select_related_or_admin"
on public.household_members
for select
to authenticated
using (
  public.is_household_owner(household_id)
  or public.is_admin_or_moderator()
  or public.shares_approved_proposal_with_household(household_id)
);

create policy "household_members_insert_own"
on public.household_members
for insert
to authenticated
with check (public.is_household_owner(household_id));

create policy "household_members_update_own"
on public.household_members
for update
to authenticated
using (public.is_household_owner(household_id) or public.is_admin_or_moderator())
with check (public.is_household_owner(household_id) or public.is_admin_or_moderator());

create policy "household_members_delete_own"
on public.household_members
for delete
to authenticated
using (public.is_household_owner(household_id) or public.is_admin_or_moderator());

create policy "meetup_proposals_select_host_attendee_or_admin"
on public.meetup_proposals
for select
to authenticated
using (
  public.is_proposal_host(id)
  or public.has_approved_rsvp(id)
  or public.is_admin_or_moderator()
);

create policy "meetup_proposals_insert_by_host"
on public.meetup_proposals
for insert
to authenticated
with check (public.is_household_owner(host_household_id));

create policy "meetup_proposals_update_by_host_or_admin"
on public.meetup_proposals
for update
to authenticated
using (public.is_proposal_host(id) or public.is_admin_or_moderator())
with check (public.is_household_owner(host_household_id) or public.is_admin_or_moderator());

create policy "meetup_proposals_delete_draft_by_host_or_admin"
on public.meetup_proposals
for delete
to authenticated
using (
  public.is_admin_or_moderator()
  or (status = 'draft' and public.is_proposal_host(id))
);

create policy "proposal_options_select_available"
on public.proposal_options
for select
to authenticated
using (
  public.is_publicly_discoverable_proposal(proposal_id)
  or public.is_proposal_host(proposal_id)
  or public.has_approved_rsvp(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "proposal_options_insert_by_host"
on public.proposal_options
for insert
to authenticated
with check (public.is_proposal_host(proposal_id));

create policy "proposal_options_update_by_host_or_admin"
on public.proposal_options
for update
to authenticated
using (public.is_proposal_host(proposal_id) or public.is_admin_or_moderator())
with check (public.is_proposal_host(proposal_id) or public.is_admin_or_moderator());

create policy "proposal_options_delete_by_host_or_admin"
on public.proposal_options
for delete
to authenticated
using (public.is_proposal_host(proposal_id) or public.is_admin_or_moderator());

create policy "interest_responses_select_host_owner_or_admin"
on public.interest_responses
for select
to authenticated
using (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "interest_responses_insert_own_for_open_proposal"
on public.interest_responses
for insert
to authenticated
with check (
  public.is_household_owner(household_id)
  and public.is_publicly_discoverable_proposal(proposal_id)
  and status = 'interested'
);

create policy "interest_responses_update_host_owner_or_admin"
on public.interest_responses
for update
to authenticated
using (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.is_admin_or_moderator()
)
with check (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "interest_response_options_select_accessible_response"
on public.interest_response_options
for select
to authenticated
using (
  exists (
    select 1
    from public.interest_responses ir
    where ir.id = interest_response_options.interest_response_id
      and (
        public.is_household_owner(ir.household_id)
        or public.is_proposal_host(ir.proposal_id)
        or public.is_admin_or_moderator()
      )
  )
);

create policy "interest_response_options_insert_own_response"
on public.interest_response_options
for insert
to authenticated
with check (
  exists (
    select 1
    from public.interest_responses ir
    join public.proposal_options po
      on po.id = interest_response_options.proposal_option_id
    where ir.id = interest_response_options.interest_response_id
      and ir.proposal_id = po.proposal_id
      and public.is_household_owner(ir.household_id)
  )
);

create policy "interest_response_options_delete_own_response_or_admin"
on public.interest_response_options
for delete
to authenticated
using (
  exists (
    select 1
    from public.interest_responses ir
    where ir.id = interest_response_options.interest_response_id
      and (
        public.is_household_owner(ir.household_id)
        or public.is_admin_or_moderator()
      )
  )
);

create policy "rsvps_select_related_or_admin"
on public.rsvps
for select
to authenticated
using (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.has_approved_rsvp(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "rsvps_insert_own_for_rsvp_open"
on public.rsvps
for insert
to authenticated
with check (
  public.is_household_owner(household_id)
  and status = 'requested'
  and exists (
    select 1
    from public.meetup_proposals mp
    where mp.id = rsvps.proposal_id
      and mp.status in ('rsvp_open', 'confirmed')
      and mp.manual_review_status = 'approved'
  )
);

create policy "rsvps_update_host_owner_or_admin"
on public.rsvps
for update
to authenticated
using (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.is_admin_or_moderator()
)
with check (
  public.is_household_owner(household_id)
  or public.is_proposal_host(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "event_messages_select_event_participants"
on public.event_messages
for select
to authenticated
using (
  public.is_proposal_host(proposal_id)
  or public.has_approved_rsvp(proposal_id)
  or public.is_admin_or_moderator()
);

create policy "event_messages_insert_event_participants"
on public.event_messages
for insert
to authenticated
with check (
  sender_profile_id = public.current_profile_id()
  and (
    (message_type = 'host_announcement' and public.is_proposal_host(proposal_id))
    or (
      message_type = 'approved_attendee_message'
      and public.has_approved_rsvp(proposal_id)
    )
    or (message_type = 'system' and public.is_admin_or_moderator())
  )
);

create policy "reconnect_interests_select_related_or_admin"
on public.reconnect_interests
for select
to authenticated
using (
  public.is_household_owner(from_household_id)
  or public.is_household_owner(to_household_id)
  or public.is_admin_or_moderator()
);

create policy "reconnect_interests_insert_own_after_attendance"
on public.reconnect_interests
for insert
to authenticated
with check (
  public.is_household_owner(from_household_id)
  and exists (
    select 1
    from public.rsvps from_rsvp
    join public.rsvps to_rsvp
      on to_rsvp.proposal_id = from_rsvp.proposal_id
    where from_rsvp.proposal_id = reconnect_interests.proposal_id
      and from_rsvp.household_id = reconnect_interests.from_household_id
      and to_rsvp.household_id = reconnect_interests.to_household_id
      and from_rsvp.status = 'attended'
      and to_rsvp.status = 'attended'
  )
);

create policy "reports_select_own_or_admin"
on public.reports
for select
to authenticated
using (
  reporter_profile_id = public.current_profile_id()
  or public.is_admin_or_moderator()
);

create policy "reports_insert_own"
on public.reports
for insert
to authenticated
with check (
  reporter_profile_id = public.current_profile_id()
  and status = 'open'
);

create policy "reports_update_admin"
on public.reports
for update
to authenticated
using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

create policy "blocks_select_own"
on public.blocks
for select
to authenticated
using (
  public.is_household_owner(blocker_household_id)
  or public.is_admin_or_moderator()
);

create policy "blocks_insert_own"
on public.blocks
for insert
to authenticated
with check (public.is_household_owner(blocker_household_id));

create policy "blocks_delete_own"
on public.blocks
for delete
to authenticated
using (
  public.is_household_owner(blocker_household_id)
  or public.is_admin_or_moderator()
);

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on function public.current_profile_id() to authenticated;
grant execute on function public.is_admin_or_moderator() to authenticated;
grant execute on function public.is_household_owner(uuid) to authenticated;
grant execute on function public.is_proposal_host(uuid) to authenticated;
grant execute on function public.has_approved_rsvp(uuid, uuid) to authenticated;
grant execute on function public.is_publicly_discoverable_proposal(uuid) to authenticated;
grant execute on function public.shares_approved_proposal_with_household(uuid) to authenticated;
grant select on public.household_public_profiles to authenticated;
grant select on public.meetup_proposals_public to authenticated;
