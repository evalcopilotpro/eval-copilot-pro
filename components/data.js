export const SAMPLE_PRDS = [
  {
    label: 'Payments Checkout',
    text: `Product Requirements: One-Click Checkout

We need to build a one-click checkout experience for returning customers. Users who have saved payment methods should be able to complete a purchase with a single tap/click from the product page.

Key requirements:
- Display a "Buy Now" button on product pages for logged-in users with saved payment info
- Support credit cards, debit cards, and digital wallets (Apple Pay, Google Pay)
- Process payment within 3 seconds of button tap
- Show order confirmation with estimated delivery date
- Send confirmation email and push notification
- Handle failed payments gracefully with retry option
- Must comply with PCI DSS requirements
- Support partial refunds within 30 days

Edge cases to consider:
- What if the saved card is expired?
- What about items that are out of stock between tap and processing?
- International orders with currency conversion

Target: 15% conversion lift vs current 4-step checkout`,
  },
  {
    label: 'AI Content Moderation',
    text: `PRD: AI-Powered Content Moderation System

Build an automated content moderation pipeline for our user-generated content platform. Currently moderators review ~50K posts/day manually with 24hr average review time. We need to cut this to <1 hour for 90% of content.

Requirements:
- Auto-classify content into: safe, needs_review, auto_remove
- Support text, images, and short video (<60s) content types
- Maintain 99.5% accuracy on auto_remove decisions (false positive rate <0.5%)
- Human moderator queue for needs_review items with AI-suggested actions
- Real-time moderation for live chat/streaming features
- Configurable sensitivity levels per community/channel
- Appeal workflow: users can contest auto_remove decisions
- Dashboard showing moderation metrics, trends, false positive rates
- Must support 12 languages at launch
- GDPR compliance: all moderation decisions must be explainable and auditable

Performance targets:
- <500ms classification latency for text
- <5s for images
- <30s for video
- Handle 100K posts/hour at peak`,
  },
  {
    label: 'Employee Onboarding',
    text: `PRD: Employee Onboarding Portal

Create a self-service onboarding portal for new hires. Current onboarding takes 2 weeks with heavy HR involvement. Goal: reduce to 3 days with 80% self-service completion.

Features needed:
- Pre-day-one portal access with welcome message and checklist
- Document upload for tax forms, ID verification, emergency contacts
- IT equipment selection and shipping tracker
- Automatic provisioning of email, Slack, GitHub, and tool access
- Interactive org chart showing team, manager, skip-level, and buddy
- Training module assignments based on role and department
- First-week calendar auto-populated with orientation sessions
- Progress tracker visible to new hire, manager, and HR
- Feedback survey at day 7, 30, and 90

Nice to have:
- AI chatbot for common onboarding questions
- Virtual office tour
- Team introduction video compilation`,
  },
];

export const AGENT_CONFIG = {
  prd_analyst: { name: 'PRD Analyst', icon: '📋', color: '#0D9488', bgLight: '#F0FDFA', description: 'Parses & structures requirements' },
  criteria_engine: { name: 'Criteria Engine', icon: '✅', color: '#7C3AED', bgLight: '#F5F3FF', description: 'Generates acceptance criteria' },
  test_architect: { name: 'Test Architect', icon: '🧪', color: '#DC2626', bgLight: '#FEF2F2', description: 'Creates executable test plans' },
  quality_oracle: { name: 'Quality Oracle', icon: '🔮', color: '#EA580C', bgLight: '#FFF7ED', description: 'Delivers PM-readable verdicts' },
};

export const PIPELINE_ORDER = ['prd_analyst', 'criteria_engine', 'test_architect', 'quality_oracle'];
