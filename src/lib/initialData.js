export const INITIAL_DATABASE = {
  users: [
    {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex@eduvault.io',
      role: 'premium',
      plan: 'monthly',
      emailVerified: true,
      quotaRemaining: 12,
      quotaMax: 15,
      renewalDate: 'Nov 17, 2026',
      singlePdfUnlockedIds: []
    },
    {
      id: 2,
      name: 'Sophia Chen',
      email: 'sophia@stanford.edu',
      role: 'premium',
      plan: 'yearly',
      emailVerified: true,
      quotaRemaining: 999,
      quotaMax: 999,
      renewalDate: 'Oct 17, 2027',
      singlePdfUnlockedIds: []
    },
    {
      id: 3,
      name: "Liam O'Connor",
      email: 'liam@freelance.dev',
      role: 'normal',
      plan: 'free',
      emailVerified: true,
      quotaRemaining: 0,
      quotaMax: 0,
      renewalDate: 'N/A (Free)',
      singlePdfUnlockedIds: []
    },
    {
      id: 4,
      name: 'Maya Lin',
      email: 'maya@startup.io',
      role: 'normal',
      plan: 'single',
      emailVerified: true,
      quotaRemaining: 1,
      quotaMax: 1,
      renewalDate: 'One-Time Credit',
      singlePdfUnlockedIds: [102]
    },
    {
      id: 5,
      name: 'Noah Patel',
      email: 'noah@unverified.org',
      role: 'normal',
      plan: 'free',
      emailVerified: false,
      quotaRemaining: 0,
      quotaMax: 0,
      renewalDate: 'Pending Opt-In',
      singlePdfUnlockedIds: []
    },
    {
      id: 6,
      name: 'Elena Vance (Admin)',
      email: 'admin@eduvault.io',
      role: 'admin',
      plan: 'yearly',
      emailVerified: true,
      quotaRemaining: 999,
      quotaMax: 999,
      renewalDate: 'Permanent Admin',
      singlePdfUnlockedIds: []
    }
  ],

  resources: [
    {
      id: 101,
      title: 'Distributed Systems & High-Availability Architecture',
      category: 'System Design',
      author: 'Dr. Elena Vance',
      pages: 184,
      price: 7.99,
      downloads: 118,
      abstract: 'Master consensus algorithms (Raft, Paxos), event-driven microservices, idempotency keys, and multi-region failover blueprints used at scale.'
    },
    {
      id: 102,
      title: 'Full-Stack React, Node.js & PostgreSQL Production Handbook',
      category: 'Full-Stack',
      author: 'Marcus Sterling',
      pages: 210,
      price: 7.99,
      downloads: 94,
      abstract: 'End-to-end engineering guide covering JWT rotation, RBAC middleware, Prisma/PostgreSQL indexing, and Stripe webhook idempotency.'
    },
    {
      id: 103,
      title: 'Applied Large Language Models & RAG Pipelines',
      category: 'AI & Data',
      author: 'Dr. Priya Nair',
      pages: 156,
      price: 7.99,
      downloads: 67,
      abstract: 'Build low-latency vector search pipelines, semantic chunking strategies, and evaluation harnesses for enterprise AI assistants.'
    },
    {
      id: 104,
      title: 'Zero-Trust Cloud Security & OAuth 2.1 Implementation',
      category: 'Cloud & Security',
      author: 'Devon Brooks',
      pages: 128,
      price: 7.99,
      downloads: 41,
      abstract: 'Practical reference for PKCE flows, double opt-in verification tokens, hardware MFA, and container sandboxing in AWS & GCP.'
    },
    {
      id: 105,
      title: 'Database Internals: B-Trees, WAL & Query Optimizers',
      category: 'System Design',
      author: 'Prof. Kenji Sato',
      pages: 240,
      price: 7.99,
      downloads: 15,
      abstract: 'Deep dive into storage engines, MVCC snapshot isolation, write-ahead logging, and diagnosing slow PostgreSQL execution plans.'
    },
    {
      id: 106,
      title: 'Modern TailwindCSS Design Systems & Accessibility',
      category: 'Full-Stack',
      author: 'Claire Dubois',
      pages: 112,
      price: 7.99,
      downloads: 7,
      abstract: 'Craft WCAG AA compliant interfaces, responsive fluid typography, dark-mode tokens, and reusable component primitives.'
    }
  ],

  payments: [
    { id: 'TXN-99481', date: 'Oct 17, 2026', user: 'Alex Rivera', item: 'Premium Monthly Plan', gateway: 'Stripe', amount: 19.00, status: 'Succeeded' },
    { id: 'TXN-99420', date: 'Oct 12, 2026', user: 'Sophia Chen', item: 'Premium Yearly Plan', gateway: 'PayPal', amount: 149.00, status: 'Succeeded' },
    { id: 'TXN-99385', date: 'Oct 09, 2026', user: 'Maya Lin', item: 'Single PDF (#102 Full-Stack Handbook)', gateway: 'Stripe', amount: 7.99, status: 'Succeeded' }
  ],

  emails: [
    {
      id: 1,
      to: 'alex@eduvault.io',
      subject: '[SendGrid] Double Opt-In Verified & Monthly Subscription Active',
      timestamp: 'Oct 17, 2026 • 09:15 AM',
      body: 'Your email address has been verified via double opt-in. Your Premium Monthly quota of 15 PDF downloads is active until Nov 17, 2026.',
      actionType: null
    }
  ],

  subscriptions: [
    { id: 'SUB-1001', userId: 1, userEmail: 'alex@eduvault.io', planName: 'monthly', billingCycle: 'Monthly', price: 19.00, status: 'Active', startDate: 'Oct 17, 2026', nextBillingDate: 'Nov 17, 2026' },
    { id: 'SUB-1002', userId: 2, userEmail: 'sophia@stanford.edu', planName: 'yearly', billingCycle: 'Annual', price: 149.00, status: 'Active', startDate: 'Oct 17, 2026', nextBillingDate: 'Oct 17, 2027' },
    { id: 'SUB-1003', userId: 4, userEmail: 'maya@startup.io', planName: 'single', billingCycle: 'One-Time', price: 7.99, status: 'Active', startDate: 'Oct 09, 2026', nextBillingDate: 'Permanent' }
  ]
};
