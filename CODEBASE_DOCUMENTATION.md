# LinkerAI - Codebase Documentation

> **Last Updated**: November 18, 2025
> **Platform**: AI-Focused Freelance Marketplace (MVP)
> **Status**: Backend Complete, Frontend UI Partial

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Features Implemented](#features-implemented)
5. [What Needs to be Done](#what-needs-to-be-done)
6. [Codebase Structure](#codebase-structure)
7. [API Reference](#api-reference)
8. [Environment Setup](#environment-setup)
9. [Production Checklist](#production-checklist)

---

## Project Overview

**LinkerAI** is a modern freelance marketplace platform specifically designed for connecting AI experts and developers with clients who need AI/ML services. The platform features:

- **Two User Types**: Clients (post projects) and Freelancers (submit proposals)
- **Payment Model**: Fixed-price projects with milestone-based escrow (50% upfront, 50% on completion)
- **Platform Fee**: 15% (configurable)
- **Core Flow**: Project Posting → Proposal Submission → Hiring → Escrow Payment → Work Delivery → Payout

**Current State**:
- Backend: 95% complete with full database schema, RLS policies, and API routes
- Frontend: 70% complete with core features implemented
- Stripe Integration: Backend complete, frontend UI partially implemented
- Production Ready: Yes (with minor UI completions needed)

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect
- **Real-time**: Supabase Realtime (infrastructure ready)

---

## Database Schema

### Core Tables

#### 1. `users`
**Purpose**: User profiles (extends Supabase Auth)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (matches Supabase Auth user ID) |
| email | VARCHAR | Unique email |
| full_name | VARCHAR | User's full name |
| role | VARCHAR | 'admin', 'client', or 'freelancer' |
| company_name | VARCHAR | Optional, for clients |
| avatar_url | TEXT | Profile picture URL |
| email_verified | BOOLEAN | Email verification status |
| is_active | BOOLEAN | Account active status |
| is_banned | BOOLEAN | Ban status |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last update |

**Note**: Passwords managed by Supabase Auth
**Indexes**: email, role, is_active
**RLS**: Enabled

---

#### 2. `client_profiles`
**Purpose**: Extended profile for clients

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| profile_image | TEXT | Profile image URL |
| location | VARCHAR | City/Country |
| website | VARCHAR | Company website |
| industry | VARCHAR | Business industry |
| company_size | VARCHAR | Team size |
| about_company | TEXT | Company description |
| project_goals | TEXT[] | Array of project goals |
| project_description | TEXT | What they're looking for |
| budget_range | VARCHAR | 'small', 'medium', 'large', 'enterprise' |
| timeline | VARCHAR | 'urgent', 'short', 'medium', 'long' |
| onboarding_completed | BOOLEAN | Onboarding status |

**Indexes**: user_id, industry, budget_range
**RLS**: Disabled

---

#### 3. `freelancer_profiles`
**Purpose**: Extended profile for freelancers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| title | VARCHAR | Professional title (e.g., "AI Engineer") |
| bio | TEXT | Professional bio |
| skills | TEXT[] | Array of skills |
| experience | INT | Years of experience |
| hourly_rate | DECIMAL | Hourly rate (USD) |
| work_experience | JSONB | Work history JSON array |
| portfolio | JSONB | Portfolio items JSON array |
| onboarding_completed | BOOLEAN | Onboarding status |
| search_vector | TSVECTOR | Full-text search index |

**JSONB Structure**:
```json
// work_experience
[
  {
    "company": "TechCorp",
    "title": "Senior AI Engineer",
    "duration": "2020-2023",
    "description": "Built ML models..."
  }
]

// portfolio
[
  {
    "title": "Project Name",
    "description": "Description",
    "tags": ["AI", "NLP"],
    "image_url": "..."
  }
]
```

**Indexes**: user_id, skills (GIN), hourly_rate, search_vector (GIN)
**RLS**: Disabled

---

#### 4. `projects`
**Purpose**: Client project postings

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| client_id | UUID | FK to users |
| title | VARCHAR | Project title |
| category | VARCHAR | AI/ML category |
| description | TEXT | Project details |
| skills | TEXT[] | Required skills |
| fixed_budget | DECIMAL | Total budget (USD) |
| timeline | VARCHAR | Expected duration |
| status | VARCHAR | 'draft', 'open', 'in_progress', 'completed', 'cancelled' |
| proposal_count | INT | Number of proposals received |
| hired_freelancer_id | UUID | FK to users (selected freelancer) |
| attachments | JSONB | File attachments metadata |
| is_published | BOOLEAN | Visibility status |
| is_featured | BOOLEAN | Featured on homepage |
| published_at | TIMESTAMP | When published |
| search_vector | TSVECTOR | Full-text search index |

**Indexes**: client_id, status, is_published, created_at, category, skills (GIN), search_vector (GIN)
**RLS**: Enabled
- SELECT: Anyone can view published projects
- INSERT/UPDATE/DELETE: Clients can manage their own projects

**Triggers**:
- Auto-update timestamps
- Set published_at on status change to 'open'
- Update search_vector on title/description/skills change

---

#### 5. `proposals`
**Purpose**: Freelancer proposals for projects

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | FK to projects |
| freelancer_id | UUID | FK to users |
| cover_letter | TEXT | Proposal pitch |
| total_budget | DECIMAL | Freelancer's bid (USD) |
| timeline | VARCHAR | Proposed duration |
| status | VARCHAR | 'submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn' |
| viewed_by_client | BOOLEAN | Has client viewed it |
| client_feedback | TEXT | Rejection feedback |

**Unique Constraint**: (project_id, freelancer_id) - one proposal per freelancer per project
**Indexes**: project_id, freelancer_id, status
**RLS**: Enabled
- SELECT: Freelancers see own, clients see their project's proposals
- INSERT: Freelancers can create
- UPDATE: Freelancers can withdraw, clients can update status

**Triggers**:
- Auto-increment project.proposal_count on INSERT
- Auto-decrement project.proposal_count on DELETE

---

#### 6. `project_deliverables`
**Purpose**: Work submissions from freelancers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | FK to projects |
| freelancer_id | UUID | FK to users |
| title | VARCHAR | Deliverable title |
| description | TEXT | What was delivered |
| status | TEXT | 'submitted', 'approved', 'revision_requested' |
| submitted_at | TIMESTAMP | Submission time |
| reviewed_at | TIMESTAMP | Review time |
| review_feedback | TEXT | Client feedback |

**Note**: Text-based only (file attachments not implemented)
**RLS**: Enabled
- Freelancers: view/create own deliverables
- Clients: view/update deliverables for their projects

---

### Messaging Tables

#### 7. `conversations`
**Purpose**: Conversation containers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| last_message_id | UUID | Most recent message |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last activity |

**RLS**: Enabled - users can only view conversations they're in

---

#### 8. `conversation_participants`
**Purpose**: Links users to conversations

| Column | Type | Description |
|--------|------|-------------|
| conversation_id | UUID | FK to conversations |
| user_id | UUID | FK to users |
| unread_count | INT | Unread messages count |
| has_new_messages | BOOLEAN | New message flag |

**Primary Key**: (conversation_id, user_id)
**RLS**: Enabled

---

#### 9. `messages`
**Purpose**: Individual messages

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | FK to conversations |
| sender_id | UUID | FK to users |
| content | TEXT | Message text |
| created_at | TIMESTAMP | Send time |

**Indexes**: conversation_id, created_at
**RLS**: Enabled - users can view/send messages in their conversations

**Note**: File attachments planned but not implemented

---

### Notification Tables

#### 10. `notifications`
**Purpose**: In-app notifications

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| category | ENUM | 'project_opportunity', 'proposal', 'contract', 'payment', 'message', 'review', 'system' |
| type | TEXT | Specific notification type |
| title | VARCHAR | Notification title |
| message | TEXT | Notification body |
| project_id | UUID | Related project (nullable) |
| proposal_id | UUID | Related proposal (nullable) |
| conversation_id | UUID | Related conversation (nullable) |
| payment_intent_id | UUID | Related payment (nullable) |
| actor_id | UUID | Who triggered it |
| actor_name | VARCHAR | Actor's name |
| actor_avatar_url | TEXT | Actor's avatar |
| metadata | JSONB | Additional data |
| action_url | TEXT | Click destination |
| is_read | BOOLEAN | Read status |
| is_archived | BOOLEAN | Archived status |
| read_at | TIMESTAMP | When read |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

**Indexes**: user_id, (user_id, is_read), project_id, proposal_id, category, created_at, actor_id
**RLS**: Enabled - users can only view/update their own notifications

**Notification Types**: 17 types for freelancers, 18 for clients (see notifications.md)

---

#### 11. `notification_preferences`
**Purpose**: User notification settings

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | FK to users (UNIQUE) |
| inapp_project_updates | BOOLEAN | Project notifications |
| inapp_proposal_updates | BOOLEAN | Proposal notifications |
| inapp_messages | BOOLEAN | Message notifications |
| inapp_payments | BOOLEAN | Payment notifications |
| inapp_reviews | BOOLEAN | Review notifications |
| inapp_system | BOOLEAN | System notifications |

**Default**: All enabled
**RLS**: Enabled
**Trigger**: Auto-creates row for new users

---

### Payment Tables (Stripe)

#### 12. `stripe_accounts`
**Purpose**: Stripe Connected Accounts for freelancers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users (UNIQUE) |
| stripe_account_id | TEXT | Stripe account ID (UNIQUE) |
| account_type | TEXT | 'standard', 'express', 'custom' |
| charges_enabled | BOOLEAN | Can receive payments |
| payouts_enabled | BOOLEAN | Can withdraw funds |
| details_submitted | BOOLEAN | Onboarding complete |
| country | VARCHAR | Account country |
| currency | VARCHAR | Default currency |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last update |

**RLS**: Enabled - users can view their own account

---

#### 13. `payment_intents`
**Purpose**: Escrow payments (client to platform)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | FK to projects |
| client_id | UUID | FK to users |
| freelancer_id | UUID | FK to users |
| stripe_payment_intent_id | TEXT | Stripe PI ID (UNIQUE) |
| amount | INT | Amount in cents |
| currency | TEXT | Currency code (default 'usd') |
| status | TEXT | 'requires_payment_method', 'requires_confirmation', 'succeeded', 'canceled' |
| milestone_type | TEXT | 'upfront_50', 'completion_50' |
| platform_fee | INT | Platform fee in cents |
| application_fee | INT | Stripe fee in cents |
| metadata | JSONB | Additional data |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

**RLS**: Enabled - clients and freelancers can view their own payment intents
**Indexes**: project_id, client_id, freelancer_id, stripe_payment_intent_id

**Payment Flow**:
1. Client pays 50% upfront → PaymentIntent created with milestone_type='upfront_50'
2. Funds held in platform Stripe account
3. Freelancer completes work
4. Client pays final 50% → PaymentIntent created with milestone_type='completion_50'
5. Platform releases funds via Transfers

---

#### 14. `transfers`
**Purpose**: Payouts from platform to freelancers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| payment_intent_id | UUID | FK to payment_intents |
| project_id | UUID | FK to projects |
| freelancer_id | UUID | FK to users |
| freelancer_stripe_account_id | TEXT | Destination account |
| stripe_transfer_id | TEXT | Stripe transfer ID (UNIQUE) |
| amount | INT | Amount in cents |
| status | TEXT | 'pending', 'paid', 'failed', 'canceled', 'reversed' |
| description | TEXT | Transfer description |
| metadata | JSONB | Additional data |
| transferred_at | TIMESTAMP | When transferred |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

**RLS**: Enabled - freelancers can view their own transfers

---

#### 15. `payment_transactions`
**Purpose**: Transaction history/ledger

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| project_id | UUID | FK to projects (nullable) |
| type | TEXT | 'payment', 'payout', 'refund', 'platform_fee' |
| amount | INT | Amount in cents |
| status | TEXT | Transaction status |
| stripe_id | TEXT | Related Stripe object ID |
| description | TEXT | Transaction description |
| metadata | JSONB | Additional data |
| created_at | TIMESTAMP | Transaction time |

**RLS**: Enabled - users can view their own transactions
**Indexes**: user_id, project_id, type, created_at

---

### Database Functions (RPCs)

#### `create_and_get_conversation(user_id_1 UUID, user_id_2 UUID)`
**Purpose**: Create conversation or return existing one between two users
**Returns**: UUID (conversation_id)
**Security**: DEFINER
**Used in**: Proposal acceptance, direct messaging

---

#### `search_projects(search_query TEXT)`
**Purpose**: Full-text search for projects
**Returns**: Table with project data + relevance rank
**Features**:
- Typo tolerance (websearch_to_tsquery)
- Weighted search (title > description > skills)
- Ordered by rank DESC, created_at DESC

---

#### `search_freelancers(search_query TEXT)`
**Purpose**: Full-text search for freelancers
**Returns**: Table with freelancer profile data + rank
**Features**: Similar to search_projects

---

#### Notification Functions
- `create_notification()` - Create notification with preference checks
- `mark_notification_read(notification_id UUID)` - Mark single as read
- `mark_all_notifications_read(user_id UUID)` - Mark all as read
- `get_unread_notification_count(user_id UUID)` - Get unread count
- `archive_notification(notification_id UUID)` - Archive notification
- `cleanup_old_notifications(days INT)` - Delete old archived notifications (for cron jobs)

---

## Features Implemented

### 1. Authentication System
**Location**: [src/features/auth/](src/features/auth/)

**Implementation**: Supabase Auth

**Features**:
- Email/password authentication
- Role-based signup (client/freelancer)
- Email verification
- Password reset flow
- Session management
- Server-side auth utilities:
  - `getServerSession()` - Get session
  - `getServerUser()` - Get user with profile
  - `requireAuth()` - Protect routes
  - `requireRole(role)` - Role-based access
  - `isAuthenticated()` - Check auth status

**Routes**:
- `/signup` - User registration
- `/login` - Sign in
- `/verify-email` - Email verification
- `/forgot-password` - Request reset
- `/reset-password` - Reset password

**User Flow**:
1. User signs up via Supabase Auth (`supabase.auth.signUp()`)
2. Profile created in `users` table with role
3. Email verification sent automatically by Supabase
4. User redirected to role-specific onboarding
5. Session managed via Supabase cookies

**Status**: ✅ Fully implemented

---

### 2. Onboarding System
**Location**: [src/features/onboarding/](src/features/onboarding/)

**Client Onboarding** ([/onboarding/client](src/app/[locale]/(protected)/onboarding/client)):
1. Profile Information (image, location)
2. Company Information (website, industry, size, about)
3. Project Goals (goals array, description)
4. Budget & Timeline preferences

**Freelancer Onboarding** ([/onboarding/freelancer](src/app/[locale]/(protected)/onboarding/freelancer)):
1. Profile Information (image, title, location)
2. Professional Info (bio, experience years)
3. Skills selection
4. Portfolio item (title, description, tags, image)
5. Hourly rate

**API Routes**:
- `POST /api/onboarding/client` - Save client profile
- `GET /api/onboarding/client` - Fetch client data
- `POST /api/onboarding/freelancer` - Save freelancer profile
- `GET /api/onboarding/freelancer` - Fetch freelancer data

**Storage**:
- Data saved to `client_profiles` or `freelancer_profiles`
- `onboarding_completed` flag set to true
- Work experience/portfolio in JSONB columns

**Status**: ✅ Fully implemented

---

### 3. Browse & Search
**Location**: [src/features/browse/](src/features/browse/)

**Browse Page** ([/browse](src/app/[locale]/(public)/browse/page.tsx)):
- **Projects Tab**: Browse all open projects
- **Freelancers Tab**: Browse freelancer profiles

**Project Filters**:
- Category
- Skills (multi-select)
- Budget range (min/max)
- Search query (full-text)

**Freelancer Filters**:
- Skills (multi-select)
- Hourly rate range (min/max)
- Experience (years)
- Location
- Search query (full-text)

**Search Features**:
- PostgreSQL Full-Text Search (tsvector)
- GIN indexes for performance
- Typo tolerance (websearch_to_tsquery)
- Weighted ranking (title > description > skills)
- Instant results

**Components**:
- [browse-filters.tsx](src/features/browse/components/browse-filters.tsx) - Filter UI
- [project-card.tsx](src/features/browse/components/project-card.tsx) - Project cards
- [freelancer-card.tsx](src/features/browse/components/freelancer-card.tsx) - Freelancer cards
- [project-detail-sheet.tsx](src/features/browse/components/project-detail-sheet.tsx) - Project details
- [freelancer-detail-sheet.tsx](src/features/browse/components/freelancer-detail-sheet.tsx) - Freelancer details
- [search-input.tsx](src/components/search/search-input.tsx) - Reusable search component

**API** ([api/browse.ts](src/features/browse/api/browse.ts)):
- `fetchBrowseProjects(filters)` - Get projects with filters
- `fetchFeaturedProjects(limit)` - Featured projects
- `fetchBrowseFreelancers(filters)` - Get freelancers with filters
- `fetchTopFreelancers(limit)` - Top freelancers
- `fetchProjectCategories()` - All categories
- `fetchFreelancerSkills()` - All skills
- `fetchBrowseStats()` - Total counts

**Status**: ✅ Fully implemented
**Improvements Planned**: See [SEARCH_IMPROVEMENT_PLAN.md](SEARCH_IMPROVEMENT_PLAN.md)

---

### 4. Project Management
**Location**: [src/features/projects/](src/features/projects/)

**Features**:
- Multi-step project posting form
- Project listing (client's projects)
- Project detail view
- Publish/unpublish projects
- Close project
- Hire freelancer

**Project Posting Flow** ([/projects/new](src/app/[locale]/(protected)/projects/new)):
1. **Project Details**: Title, category, description, skills
2. **Budget & Timeline**: Fixed budget, expected duration
3. **Invite Experts**: Optional freelancer invitations
4. **Review & Publish**: Preview and publish

**Project Statuses**:
- `draft` - Not published
- `open` - Accepting proposals
- `in_progress` - Freelancer hired
- `completed` - Work finished
- `cancelled` - Cancelled by client

**Components**:
- [project-posting-form.tsx](src/features/projects/components/project-posting-form.tsx) - Main form
- [project-posting/](src/features/projects/components/project-posting/) - Step components
- [projects-list/](src/features/projects/components/projects-list/) - Project list views

**API** ([api/projects.ts](src/features/projects/api/projects.ts)):
- Create, read, update, delete projects
- Publish/unpublish
- Close project
- Hire freelancer

**Payment Structure**:
- Fixed-price only (no hourly)
- 50% upfront milestone
- 50% completion milestone
- Platform fee: 15% (configurable)

**Status**: ✅ Fully implemented

---

### 5. Proposal System
**Location**: [src/features/proposals/](src/features/proposals/)

**Features**:
- Submit proposals to projects
- View own proposals (freelancer)
- View project proposals (client)
- Accept/reject proposals
- Shortlist proposals
- Withdraw proposals
- View tracking (viewed_by_client flag)

**Proposal Submission** (from project detail):
- Cover letter
- Budget (total bid)
- Timeline (expected duration)
- Optional: Attachments (planned, not implemented)

**Proposal Statuses**:
- `submitted` - Initial state
- `under_review` - Client reviewing
- `shortlisted` - In final consideration
- `accepted` - Hired! (triggers project status change)
- `rejected` - Not selected
- `withdrawn` - Freelancer withdrew

**On Acceptance**:
1. Project status → 'in_progress'
2. Project.hired_freelancer_id set
3. Conversation created between client & freelancer
4. Notification sent to freelancer

**Components**:
- [submit-proposal/](src/features/proposals/components/submit-proposal/) - Multi-section form
  - Project overview
  - Client info
  - Cover letter input
  - Budget & timeline inputs
  - Payment structure info
  - Tips sidebar
  - Success dialog

**API** ([api/proposals.ts](src/features/proposals/api/proposals.ts)):
- `createProposal()` - Submit proposal
- `acceptProposal()` - Accept (creates conversation)
- `rejectProposal()` - Reject with feedback
- `withdrawProposal()` - Freelancer withdraws
- `shortlistProposal()` - Mark for review
- `reviewProposal()` - Change status
- `markProposalAsViewed()` - Track views
- `getProposalStats()` - Statistics by status

**Status**: ✅ Fully implemented

---

### 6. Messaging System
**Location**: [src/features/messaging/](src/features/messaging/)

**Features**:
- 1-on-1 conversations
- Text messaging
- Unread count tracking
- Last message preview
- Conversation search by participant name
- Auto-create conversation on proposal acceptance

**Messaging Interface** ([/messages](src/app/[locale]/(protected)/messages/page.tsx)):
- Left panel: Conversation list
- Right panel: Active conversation with messages
- Message input with send button
- Empty state when no conversations

**Components**:
- [messaging-view.tsx](src/features/messaging/components/messaging-view.tsx) - Main container
- [conversation-list.tsx](src/features/messaging/components/conversation-list.tsx) - List
- [conversation-item.tsx](src/features/messaging/components/conversation-item.tsx) - Preview
- [message-list.tsx](src/features/messaging/components/message-list.tsx) - Messages
- [message-bubble.tsx](src/features/messaging/components/message-bubble.tsx) - Single message
- [message-input.tsx](src/features/messaging/components/message-input.tsx) - Input field
- [chat-header.tsx](src/features/messaging/components/chat-header.tsx) - Header

**API** ([api/messaging.ts](src/features/messaging/api/messaging.ts)):
- `getConversations(userId)` - Fetch all conversations
- `getMessages(conversationId)` - Fetch messages
- `sendMessage(conversationId, senderId, content)` - Send message
- `createOrGetConversation(userId1, userId2)` - Get/create conversation (uses RPC)
- `markAsRead(conversationId, userId)` - Clear unread count
- `searchConversations(query)` - Search by participant name

**Real-time**: Infrastructure ready (Supabase Realtime), not yet implemented

**Status**: ✅ Core implemented, ⏳ Real-time pending

---

### 7. Notification System
**Location**: [src/features/notifications/](src/features/notifications/)

**Documentation**: [notifications.md](notifications.md)

**Features**:
- In-app notifications only (email/SMS not implemented)
- 7 categories, 35 total types (17 for freelancers, 18 for clients)
- User preferences per category
- Mark as read (single/all)
- Archive notifications
- Unread count badge
- Click to navigate (action_url)
- Real-time subscriptions (infrastructure ready)

**Notification Categories**:
1. `project_opportunity` - Matching projects, invitations
2. `proposal` - Proposal status changes
3. `contract` - Project updates
4. `payment` - Payment confirmations
5. `message` - New messages
6. `review` - Reviews received
7. `system` - Platform announcements

**Components**:
- [notification-bell.tsx](src/features/notifications/components/notification-bell.tsx) - Header icon with badge
- [notification-list.tsx](src/features/notifications/components/notification-list.tsx) - Notification list
- [notification-item.tsx](src/features/notifications/components/notification-item.tsx) - Single item
- [notification-toast.tsx](src/features/notifications/components/notification-toast.tsx) - Toast
- [notification-provider.tsx](src/features/notifications/context/notification-provider.tsx) - Context
- [use-notifications.ts](src/features/notifications/hooks/use-notifications.ts) - Hook

**API** ([api/notifications.ts](src/features/notifications/api/notifications.ts)):
- `fetchNotifications(filters)` - Get notifications
- `fetchUnreadCount()` - Unread count (uses RPC)
- `fetchNotificationStats()` - Stats by category
- `markNotificationAsRead(id)` - Mark as read
- `markAllNotificationsAsRead()` - Mark all as read
- `archiveNotification(id)` - Archive
- `deleteNotification(id)` - Delete
- `createNotification()` - Create (backend use)
- `fetchNotificationPreferences()` - Get preferences
- `updateNotificationPreferences()` - Update preferences
- `subscribeToNotifications(userId, callback)` - Real-time (ready)

**Trigger Points**:
- Proposal submitted → Client notified
- Proposal accepted → Freelancer notified
- Proposal rejected → Freelancer notified
- Payment succeeded → Both parties notified
- New message → Recipient notified (when implemented)

**Status**: ✅ Fully implemented

---

### 8. Payment System (Stripe)
**Location**: [src/lib/stripe/](src/lib/stripe/), [src/app/api/stripe/](src/app/api/stripe/), [src/app/api/payments/](src/app/api/payments/)

**Documentation**: [STRIPE_CONNECT_SETUP.md](STRIPE_CONNECT_SETUP.md) (790 lines, comprehensive)

**Stripe Integration**:
- Stripe Connect (Standard accounts)
- Payment Intents (escrow)
- Transfers (payouts)
- Webhooks (event handling)

**Configuration**:
- [stripe-server.ts](src/lib/stripe/stripe-server.ts) - Server-side client, platform fee config
- [stripe-client.ts](src/lib/stripe/stripe-client.ts) - Client-side loader

**API Routes**:

1. **POST /api/stripe/connect** ([route.ts](src/app/api/stripe/connect/route.ts))
   - Create Stripe Connected Account for freelancer
   - Returns: Onboarding URL (Stripe-hosted)
   - Account type: Standard (freelancer manages own dashboard)

2. **GET /api/stripe/callback** ([route.ts](src/app/api/stripe/callback/route.ts))
   - OAuth callback after Stripe onboarding
   - Updates account status in `stripe_accounts` table
   - Redirects to dashboard with success/error message

3. **POST /api/payments/create-intent** ([route.ts](src/app/api/payments/create-intent/route.ts))
   - Create payment intent for milestone (upfront or completion)
   - Calculates platform fee (15% default)
   - Uses `transfer_data` to specify freelancer's account
   - Saves to `payment_intents` table

4. **POST /api/payments/release** ([route.ts](src/app/api/payments/release/route.ts))
   - Create transfer from platform to freelancer
   - Releases escrowed funds after milestone approval
   - Logs transaction in `payment_transactions`
   - Updates `transfers` table

5. **POST /api/webhooks/stripe** ([route.ts](src/app/api/webhooks/stripe/route.ts))
   - Webhook handler with signature verification
   - Events handled:
     - `payment_intent.succeeded` - Update status, log transaction
     - `payment_intent.payment_failed` - Update status, notify user
     - `transfer.created` - Update transfer status
     - `account.updated` - Update account capabilities

**Payment Flow**:
1. Client hires freelancer (accepts proposal)
2. Client clicks "Pay 50% Upfront"
3. Stripe Elements form shown
4. Client completes payment
5. PaymentIntent created with `milestone_type='upfront_50'`
6. Funds held in platform Stripe account (escrow)
7. Freelancer works on project
8. Freelancer submits deliverable
9. Client approves deliverable
10. Platform releases 50% to freelancer via Transfer
11. Client clicks "Pay Final 50%"
12. PaymentIntent created with `milestone_type='completion_50'`
13. Platform releases final 50% to freelancer

**Platform Fee**: 15% (configurable via `STRIPE_PLATFORM_FEE_PERCENTAGE` env var)

**Payment Components** ([src/features/payment/components/](src/features/payment/components/)):
- [freelancer-payments.tsx](src/features/payment/components/freelancer-payments.tsx) - Freelancer dashboard (partial)
- [client-payments.tsx](src/features/payment/components/client-payments.tsx) - Client dashboard (partial)
- [balance-card.tsx](src/features/payment/components/shared/balance-card.tsx) - Balance display
- [payment-methods.tsx](src/features/payment/components/shared/payment-methods.tsx) - Payment methods
- [transaction-history.tsx](src/features/payment/components/shared/transaction-history.tsx) - Transaction list

**Status**:
- ✅ Backend: Fully implemented
- ⏳ Frontend: Partially implemented (structure exists, needs wiring)

---

## What Needs to be Done

### High Priority (Complete UI & Integration)

#### 1. Stripe Payment UI
**Estimated Effort**: 2-3 days

**Tasks**:
- [ ] Create Stripe Elements payment form component
  - Card input
  - Payment button
  - Loading states
  - Error handling
- [ ] Wire "Pay 50% Upfront" button to create-intent API
- [ ] Wire "Pay Final 50%" button to create-intent API
- [ ] Create payment confirmation screen
- [ ] Display payment status (pending, succeeded, failed)
- [ ] Add Stripe Connect onboarding button on freelancer dashboard
  - Call `/api/stripe/connect` to get onboarding URL
  - Redirect to Stripe onboarding
  - Handle callback from `/api/stripe/callback`
- [ ] Display Connected Account status on dashboard
  - Show if charges_enabled, payouts_enabled
  - Show verification status
- [ ] Create transaction history page (use existing component)
- [ ] Add Terms of Service agreement before payment

**Files to Create/Modify**:
- `src/features/payment/components/stripe-payment-form.tsx` (new)
- `src/features/payment/components/payment-confirmation.tsx` (new)
- `src/features/payment/components/connect-account-button.tsx` (new)
- `src/app/[locale]/(protected)/payments/page.tsx` (modify)
- `src/app/[locale]/(protected)/dashboard/page.tsx` (add Connect button for freelancers)

---

#### 2. Real-time Updates
**Estimated Effort**: 1-2 days

**Tasks**:
- [ ] Implement real-time message subscriptions
  - Subscribe to messages table on conversation open
  - Auto-append new messages
  - Show typing indicator (optional)
- [ ] Implement real-time notification subscriptions
  - Subscribe to notifications table
  - Show toast for new notifications
  - Update unread count badge
- [ ] Add real-time proposal updates
  - Notify client when new proposal submitted
  - Notify freelancer when proposal status changes

**Files to Modify**:
- `src/features/messaging/components/messaging-view.tsx`
- `src/features/notifications/context/notification-provider.tsx`
- `src/features/proposals/hooks/use-proposals.ts` (create)

**Reference**:
- Supabase Realtime docs: https://supabase.com/docs/guides/realtime
- Example subscription in `src/features/notifications/api/notifications.ts:subscribeToNotifications()`

---

#### 3. File Attachments
**Estimated Effort**: 2-3 days

**Tasks**:
- [ ] Set up Supabase Storage bucket (project-attachments)
- [ ] Create file upload component with drag-and-drop
- [ ] Implement file upload in proposals
  - Add attachment metadata to `attachments` JSONB column
  - Store file URLs from Supabase Storage
- [ ] Implement file attachments in messages
  - Add `attachments` column to messages table (migration)
  - Display file previews (images) and download links
- [ ] Implement file uploads in deliverables
  - Add `attachments` column to project_deliverables (migration)
  - Allow multiple files per deliverable

**Files to Create**:
- `supabase/migrations/028_add_message_attachments.sql`
- `supabase/migrations/029_add_deliverable_attachments.sql`
- `src/components/ui/file-upload.tsx`
- `src/lib/supabase/storage.ts` (helper functions)

**Security**:
- RLS policies on storage bucket
- File type validation (images, PDFs, docs only)
- File size limits (10MB per file)

---

### Post-MVP Features (Future)

#### Email Notifications
- [ ] Email service integration (Resend/SendGrid)
- [ ] Email templates for key actions
- [ ] Email preferences in user settings

#### Reviews & Ratings
- [ ] Reviews table migration
- [ ] Review submission after project completion
- [ ] Star ratings on profiles

#### Admin Dashboard
- [ ] Basic analytics (users, projects, revenue)
- [ ] User management
- [ ] Content moderation

#### Search Enhancements
- [ ] Debouncing for better performance
- [ ] Auto-suggestions dropdown
- [ ] Filter persistence in URL
- See [SEARCH_IMPROVEMENT_PLAN.md](SEARCH_IMPROVEMENT_PLAN.md) for full roadmap

---

## Codebase Structure

```
/Users/devanshtiwari/github/linkerai/
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── biome.json                        # Biome linter config
├── tailwind.config.ts                # Tailwind CSS config
├── CODEBASE_DOCUMENTATION.md         # This file
├── STRIPE_CONNECT_SETUP.md           # Stripe setup guide (790 lines)
├── SEARCH_IMPROVEMENT_PLAN.md        # Search roadmap
├── notifications.md                  # Notification types spec
│
├── public/                           # Static assets
│   ├── images/
│   └── icons/
│
├── email-templates/                  # Email templates
│   ├── signup-confirmation.html
│   └── password-reset.html
│
├── supabase/
│   └── migrations/                   # Database migrations (001-027)
│       ├── 001_initial_schema.sql
│       ├── 002_onboarding_profiles.sql
│       ├── ...
│       └── 027_add_stripe_payments.sql
│
└── src/
    ├── app/                          # Next.js App Router
    │   ├── [locale]/                 # Internationalized routes
    │   │   ├── (auth)/              # Auth routes (login, signup)
    │   │   │   ├── login/
    │   │   │   ├── signup/
    │   │   │   ├── verify-email/
    │   │   │   ├── forgot-password/
    │   │   │   └── reset-password/
    │   │   ├── (public)/            # Public routes
    │   │   │   ├── page.tsx         # Homepage
    │   │   │   └── browse/          # Browse projects/freelancers
    │   │   └── (protected)/         # Protected routes
    │   │       ├── dashboard/       # Dashboard
    │   │       ├── messages/        # Messaging
    │   │       ├── projects/        # Projects
    │   │       │   ├── page.tsx     # List
    │   │       │   └── new/         # Create
    │   │       ├── payments/        # Payments
    │   │       ├── notifications/   # Notifications
    │   │       └── onboarding/      # Onboarding
    │   │           ├── client/
    │   │           └── freelancer/
    │   └── api/                      # API routes
    │       ├── onboarding/
    │       │   ├── client/
    │       │   └── freelancer/
    │       ├── payments/
    │       │   ├── create-intent/
    │       │   └── release/
    │       ├── stripe/
    │       │   ├── connect/
    │       │   └── callback/
    │       ├── webhooks/
    │       │   └── stripe/
    │       └── trpc/                 # tRPC endpoints
    │
    ├── features/                     # Feature modules
    │   ├── auth/                    # Authentication
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── lib/
    │   │   └── types/
    │   ├── browse/                  # Browse & search
    │   │   ├── api/
    │   │   ├── components/
    │   │   └── types/
    │   ├── messaging/               # Messaging system
    │   │   ├── api/
    │   │   ├── components/
    │   │   └── types/
    │   ├── notifications/           # Notifications
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── hooks/
    │   │   └── types/
    │   ├── onboarding/             # User onboarding
    │   │   ├── api/
    │   │   ├── components/
    │   │   │   ├── client/
    │   │   │   └── freelancer/
    │   │   └── types/
    │   ├── payment/                # Payment UI
    │   │   ├── components/
    │   │   │   ├── shared/
    │   │   │   ├── client-payments.tsx
    │   │   │   └── freelancer-payments.tsx
    │   │   └── types/
    │   ├── projects/               # Project management
    │   │   ├── api/
    │   │   ├── components/
    │   │   │   ├── project-posting/
    │   │   │   └── projects-list/
    │   │   └── types/
    │   ├── proposals/              # Proposal system
    │   │   ├── api/
    │   │   ├── components/
    │   │   │   └── submit-proposal/
    │   │   └── types/
    │   └── profiles/               # User profiles
    │       ├── api/
    │       ├── components/
    │       ├── hooks/
    │       └── types/
    │
    ├── components/                  # Shared components
    │   ├── ui/                     # shadcn/ui components
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── dialog.tsx
    │   │   ├── card.tsx
    │   │   └── ...
    │   ├── search/                 # Search components
    │   │   └── search-input.tsx
    │   ├── layouts/                # Layout components
    │   └── auth/                   # Auth components
    │
    ├── hooks/                       # Custom React hooks
    │   └── use-*.ts
    │
    ├── lib/                         # Utility libraries
    │   ├── supabase/               # Supabase clients
    │   │   ├── admin.ts            # Service role client
    │   │   ├── server.ts           # Server client
    │   │   ├── client.ts           # Browser client
    │   │   └── middleware.ts       # Auth middleware
    │   ├── stripe/                 # Stripe config
    │   │   ├── stripe-server.ts
    │   │   └── stripe-client.ts
    │   └── utils.ts                # General utilities
    │
    ├── server/                      # Server-side code
    │   └── trpc/                   # tRPC router
    │
    ├── styles/                      # Global styles
    │   └── globals.css
    │
    └── utils/                       # Utility functions
        └── cn.ts                    # Class name utility
```

---

## API Reference

### Authentication API

**Implementation**: Supabase Auth SDK

**Signup** (`signup.ts`):
```typescript
await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      full_name: data.fullName,
      role: data.role,
      company_name: data.companyName,
    }
  }
})
```
**Side Effect**: Creates user in `users` table with role

**Login** (`login.ts`):
```typescript
await supabase.auth.signInWithPassword({
  email: data.email,
  password: data.password
})
```

**Password Reset** (`password-reset.ts`):
```typescript
// Request reset
await supabase.auth.resetPasswordForEmail(email)

// Update password
await supabase.auth.updateUser({ password: newPassword })
```

**Email Verification**: Handled automatically by Supabase

---

### Onboarding API

**File**: [src/features/onboarding/api/](src/features/onboarding/api/)

#### `POST /api/onboarding/client`
**Body**:
```json
{
  "profile_image": "url",
  "location": "San Francisco, CA",
  "website": "https://example.com",
  "industry": "Technology",
  "company_size": "11-50",
  "about_company": "We build AI solutions...",
  "project_goals": ["AI Integration", "Automation"],
  "project_description": "We need...",
  "budget_range": "medium",
  "timeline": "short"
}
```
**Returns**: `{ success: boolean, profileId: string }`

#### `GET /api/onboarding/client`
**Returns**: Client profile data

#### `POST /api/onboarding/freelancer`
**Body**:
```json
{
  "profile_image": "url",
  "title": "AI Engineer",
  "location": "Remote",
  "bio": "I specialize in...",
  "experience": 5,
  "skills": ["Python", "TensorFlow", "NLP"],
  "hourly_rate": 100,
  "work_experience": [
    {
      "company": "TechCorp",
      "title": "Senior AI Engineer",
      "duration": "2020-2023",
      "description": "Built ML models..."
    }
  ],
  "portfolio": [
    {
      "title": "AI Chatbot",
      "description": "Built chatbot for...",
      "tags": ["NLP", "GPT"],
      "image_url": "url"
    }
  ]
}
```
**Returns**: `{ success: boolean, profileId: string }`

#### `GET /api/onboarding/freelancer`
**Returns**: Freelancer profile data

---

### Browse API

**File**: [src/features/browse/api/browse.ts](src/features/browse/api/browse.ts)

#### `fetchBrowseProjects(filters)`
**Parameters**:
```typescript
{
  category?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}
```
**Returns**: `BrowseProject[]`

#### `fetchFeaturedProjects(limit: number)`
**Returns**: `BrowseProject[]`

#### `fetchBrowseFreelancers(filters)`
**Parameters**:
```typescript
{
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  minExperience?: number;
  location?: string;
  search?: string;
}
```
**Returns**: `BrowseFreelancer[]`

#### `fetchTopFreelancers(limit: number)`
**Returns**: `BrowseFreelancer[]`

#### `fetchProjectCategories()`
**Returns**: `string[]`

#### `fetchFreelancerSkills()`
**Returns**: `string[]`

#### `fetchBrowseStats()`
**Returns**: `{ totalProjects: number, totalFreelancers: number }`

---

### Projects API

**File**: [src/features/projects/api/projects.ts](src/features/projects/api/projects.ts)

#### `createProject(data)`
**Parameters**: Project data (title, description, budget, etc.)
**Returns**: `Project`

#### `updateProject(id, data)`
**Returns**: `Project`

#### `deleteProject(id)`
**Returns**: `{ success: boolean }`

#### `publishProject(id)`
**Returns**: `Project` (status changed to 'open')

#### `closeProject(id)`
**Returns**: `Project` (status changed to 'completed')

#### `hireFreelancer(projectId, freelancerId)`
**Returns**: `Project` (status changed to 'in_progress', hired_freelancer_id set)

---

### Proposals API

**File**: [src/features/proposals/api/proposals.ts](src/features/proposals/api/proposals.ts)

#### `createProposal(data)`
**Parameters**:
```typescript
{
  project_id: string;
  freelancer_id: string;
  cover_letter: string;
  total_budget: number;
  timeline: string;
}
```
**Returns**: `ProposalWithDetails` (includes freelancer info)
**Side Effects**: Creates notification for client

#### `acceptProposal(proposalId, projectId)`
**Returns**: `Proposal`
**Side Effects**:
- Updates project status to 'in_progress'
- Sets project.hired_freelancer_id
- Creates conversation between client & freelancer
- Sends notification to freelancer

#### `rejectProposal(proposalId, feedback?)`
**Returns**: `Proposal`
**Side Effects**: Sends notification to freelancer

#### `withdrawProposal(proposalId)`
**Returns**: `Proposal`

#### `shortlistProposal(proposalId)`
**Returns**: `Proposal` (status changed to 'shortlisted')

#### `markProposalAsViewed(proposalId)`
**Returns**: `Proposal` (viewed_by_client set to true)

#### `getProposalStats(freelancerId)`
**Returns**:
```typescript
{
  submitted: number;
  under_review: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
}
```

---

### Messaging API

**File**: [src/features/messaging/api/messaging.ts](src/features/messaging/api/messaging.ts)

#### `getConversations(userId)`
**Returns**: `Conversation[]` (includes last message, participant info, unread count)

#### `getMessages(conversationId)`
**Returns**: `Message[]` (ordered by created_at ASC)

#### `sendMessage(conversationId, senderId, content)`
**Returns**: `Message`
**Side Effects**: Increments recipient's unread_count

#### `createOrGetConversation(userId1, userId2)`
**Returns**: `{ conversationId: string }`
**Note**: Uses `create_and_get_conversation()` RPC

#### `markAsRead(conversationId, userId)`
**Returns**: `{ success: boolean }`
**Side Effects**: Sets unread_count to 0

#### `searchConversations(query)`
**Returns**: `Conversation[]` (filtered by participant name)

---

### Notifications API

**File**: [src/features/notifications/api/notifications.ts](src/features/notifications/api/notifications.ts)

#### `fetchNotifications(filters)`
**Parameters**:
```typescript
{
  category?: NotificationCategory;
  is_read?: boolean;
  is_archived?: boolean;
  limit?: number;
}
```
**Returns**: `Notification[]`

#### `fetchUnreadCount()`
**Returns**: `number` (uses RPC)

#### `fetchNotificationStats()`
**Returns**:
```typescript
{
  [category: string]: number; // count by category
}
```

#### `markNotificationAsRead(notificationId)`
**Returns**: `Notification`

#### `markAllNotificationsAsRead()`
**Returns**: `{ count: number }`

#### `archiveNotification(notificationId)`
**Returns**: `Notification` (is_archived set to true)

#### `deleteNotification(notificationId)`
**Returns**: `{ success: boolean }`

#### `createNotification(request)`
**Parameters**:
```typescript
{
  user_id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  project_id?: string;
  proposal_id?: string;
  conversation_id?: string;
  payment_intent_id?: string;
  actor_id?: string;
  action_url?: string;
  metadata?: object;
}
```
**Returns**: `Notification | null` (null if user has disabled category)
**Note**: Checks notification preferences before creating

#### `fetchNotificationPreferences()`
**Returns**: `NotificationPreferences`

#### `updateNotificationPreferences(preferences)`
**Returns**: `NotificationPreferences`

#### `subscribeToNotifications(userId, callback)`
**Returns**: Unsubscribe function
**Note**: Real-time subscription via Supabase Realtime

---

### Stripe API

**Files**: [src/app/api/stripe/](src/app/api/stripe/), [src/app/api/payments/](src/app/api/payments/)

#### `POST /api/stripe/connect`
**Body**: `{ userId: string }`
**Returns**:
```json
{
  "success": true,
  "onboardingUrl": "https://connect.stripe.com/..."
}
```
**Side Effects**: Creates Stripe Connected Account, saves to `stripe_accounts` table

#### `GET /api/stripe/callback?code=xxx`
**Query**: OAuth code from Stripe
**Returns**: Redirect to dashboard with success/error message
**Side Effects**: Updates account status in `stripe_accounts`

#### `POST /api/payments/create-intent`
**Body**:
```json
{
  "projectId": "uuid",
  "clientId": "uuid",
  "freelancerId": "uuid",
  "amount": 5000, // in cents
  "milestoneType": "upfront_50" | "completion_50"
}
```
**Returns**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "uuid"
}
```
**Side Effects**:
- Creates Stripe PaymentIntent with `transfer_data` to freelancer's account
- Saves to `payment_intents` table
- Calculates platform fee (15%)

#### `POST /api/payments/release`
**Body**:
```json
{
  "paymentIntentId": "uuid",
  "projectId": "uuid",
  "freelancerId": "uuid",
  "amount": 4250 // after platform fee
}
```
**Returns**:
```json
{
  "success": true,
  "transferId": "uuid"
}
```
**Side Effects**:
- Creates Stripe Transfer from platform to freelancer
- Saves to `transfers` table
- Logs transaction in `payment_transactions`

#### `POST /api/webhooks/stripe`
**Headers**: `stripe-signature`
**Body**: Stripe event object
**Returns**: `{ received: true }`
**Events Handled**:
- `payment_intent.succeeded` - Update status, log transaction, send notifications
- `payment_intent.payment_failed` - Update status, notify client
- `transfer.created` - Update transfer status
- `account.updated` - Update account capabilities

---

## Environment Setup

### Required Environment Variables

Create `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENTAGE=15

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
supabase db push

# Start development server
pnpm dev
```

### Database Setup

```bash
# Link to Supabase project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# (Optional) Seed mock data
psql -U postgres -h db.your-project.supabase.co -d postgres -f supabase/migrations/015_seed_mock_data_for_new_user.sql
```

### Stripe Setup

See [STRIPE_CONNECT_SETUP.md](STRIPE_CONNECT_SETUP.md) for detailed instructions.

**Quick Start**:
1. Create Stripe account
2. Enable Stripe Connect
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook events: `payment_intent.*`, `transfer.*`, `account.updated`
5. Copy webhook secret to `.env.local`

---

## Production Checklist

### Critical (Before Launch)
- [ ] Complete Stripe Payment UI integration
- [ ] Test full payment flow end-to-end
- [ ] Switch to live Stripe API keys
- [ ] Verify Stripe webhook signatures
- [ ] Enable HTTPS/SSL
- [ ] Set up error monitoring (Sentry)
- [ ] Mobile responsive testing
- [ ] Cross-browser testing

### Security
- [ ] Verify RLS policies on all tables
- [ ] Rotate API keys for production
- [ ] Add rate limiting
- [ ] Input sanitization review
- [ ] CAPTCHA on signup/login

### Stripe
- [ ] Test with Stripe test cards
- [ ] Set up Stripe Dashboard alerts
- [ ] Configure Stripe Radar (fraud prevention)

### Monitoring
- [ ] Analytics setup (Posthog/Mixpanel)
- [ ] Uptime monitoring
- [ ] Payment transaction logging

### Performance
- [ ] Database query optimization
- [ ] Enable Supabase connection pooling
- [ ] Image optimization
- [ ] CDN caching headers

---

## Additional Documentation

- [STRIPE_CONNECT_SETUP.md](STRIPE_CONNECT_SETUP.md) - Complete Stripe integration guide
- [SEARCH_IMPROVEMENT_PLAN.md](SEARCH_IMPROVEMENT_PLAN.md) - Search enhancement roadmap
- [notifications.md](notifications.md) - Notification types reference

---

**End of Documentation**
