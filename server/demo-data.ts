export interface BriefingData {
  summary: string;
  highlights: string[];
  generatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  isHighPriority: boolean;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
  isUrgent: boolean;
  hasAttachment: boolean;
}

export interface TeamsMessage {
  id: string;
  from: string;
  channel: string;
  preview: string;
  timestamp: string;
  mentions: boolean;
}

export interface Document {
  id: string;
  title: string;
  sharedBy: string;
  sharedAt: string;
  type: string;
  url: string;
}

export interface Commitment {
  id: string;
  description: string;
  source: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "done";
}

export const demoBriefing: BriefingData = {
  summary:
    "Good morning! You have 5 meetings today, including a critical Q3 budget review at 10 AM. There are 3 urgent emails requiring your attention — one from the VP of Engineering about the platform migration timeline. The design team shared updated wireframes for the customer portal in Teams.",
  highlights: [
    "Q3 Budget Review at 10:00 AM — prepare slide deck with updated forecasts",
    "3 urgent emails pending, including VP Engineering escalation",
    "Design wireframes for customer portal ready for review",
    "Sprint retrospective at 3 PM — team velocity report attached",
    "Contract renewal deadline for CloudSync vendor is Friday",
  ],
  generatedAt: new Date().toISOString(),
};

export const demoCalendar: Meeting[] = [
  {
    id: "m1",
    title: "Daily Standup — Platform Team",
    time: "09:00 AM",
    duration: "15 min",
    attendees: ["Sarah Chen", "Marcus Rodriguez", "Priya Patel"],
    location: "Teams — Platform Team Channel",
    isHighPriority: false,
  },
  {
    id: "m2",
    title: "Q3 Budget Review",
    time: "10:00 AM",
    duration: "1 hour",
    attendees: [
      "Jennifer Walsh (CFO)",
      "David Kim",
      "Lisa Thompson",
      "You",
    ],
    location: "Conference Room 4A",
    isHighPriority: true,
  },
  {
    id: "m3",
    title: "1:1 with Direct Report — Marcus Rodriguez",
    time: "11:30 AM",
    duration: "30 min",
    attendees: ["Marcus Rodriguez"],
    location: "Teams Call",
    isHighPriority: false,
  },
  {
    id: "m4",
    title: "Customer Portal Design Review",
    time: "1:00 PM",
    duration: "45 min",
    attendees: ["Anna Kowalski", "Tom Bradley", "UX Team"],
    location: "Teams — Design Channel",
    isHighPriority: false,
  },
  {
    id: "m5",
    title: "Sprint Retrospective — Sprint 24",
    time: "3:00 PM",
    duration: "1 hour",
    attendees: ["Full Scrum Team"],
    location: "Teams — Platform Team Channel",
    isHighPriority: false,
  },
];

export const demoEmails: Email[] = [
  {
    id: "e1",
    from: "Jennifer Walsh (CFO)",
    subject: "RE: Q3 Budget — Updated Figures Needed",
    preview:
      "Can you send me the revised cloud infrastructure costs before our 10 AM meeting? The board wants to see a breakdown by service tier.",
    receivedAt: "7:45 AM",
    isUrgent: true,
    hasAttachment: false,
  },
  {
    id: "e2",
    from: "Robert Chang (VP Engineering)",
    subject: "URGENT: Platform Migration Timeline Slip",
    preview:
      "The migration to the new microservices architecture is at risk of slipping by 2 weeks. We need to discuss resource allocation today.",
    receivedAt: "8:12 AM",
    isUrgent: true,
    hasAttachment: true,
  },
  {
    id: "e3",
    from: "Lisa Thompson (Product)",
    subject: "Customer Portal MVP — Feature Prioritization",
    preview:
      "Attached is the updated feature priority matrix based on last week's customer interviews. Three new items flagged as must-have.",
    receivedAt: "Yesterday 6:30 PM",
    isUrgent: true,
    hasAttachment: true,
  },
  {
    id: "e4",
    from: "IT Security Team",
    subject: "Quarterly Security Audit — Action Items",
    preview:
      "Please review the attached findings from this quarter's security audit. Two medium-severity items require your team's response by EOW.",
    receivedAt: "Yesterday 4:15 PM",
    isUrgent: false,
    hasAttachment: true,
  },
  {
    id: "e5",
    from: "CloudSync Vendor (partnerships@cloudsync.io)",
    subject: "Contract Renewal — Decision Required by Friday",
    preview:
      "Your enterprise license renewal is due this Friday. We've prepared a proposal with updated pricing tiers. Let's connect if you'd like to negotiate.",
    receivedAt: "Yesterday 2:00 PM",
    isUrgent: false,
    hasAttachment: true,
  },
];

export const demoTeams: TeamsMessage[] = [
  {
    id: "t1",
    from: "Anna Kowalski",
    channel: "Design — Customer Portal",
    preview:
      "Hey team, I've uploaded the final wireframes for the portal dashboard. Please review before today's 1 PM meeting. 🎨",
    timestamp: "8:30 AM",
    mentions: true,
  },
  {
    id: "t2",
    from: "Marcus Rodriguez",
    channel: "Platform Team",
    preview:
      "CI pipeline is green again after last night's fix. All integration tests passing. 🚀",
    timestamp: "8:15 AM",
    mentions: false,
  },
  {
    id: "t3",
    from: "Priya Patel",
    channel: "Platform Team",
    preview:
      "Heads up — the API latency spike from yesterday was caused by a misconfigured cache TTL. Hotfix deployed to staging.",
    timestamp: "7:50 AM",
    mentions: false,
  },
  {
    id: "t4",
    from: "David Kim",
    channel: "Leadership",
    preview:
      "Sharing the all-hands deck for Thursday. Please add your team updates to slides 12-15 by tomorrow EOD.",
    timestamp: "Yesterday 5:45 PM",
    mentions: true,
  },
  {
    id: "t5",
    from: "Sarah Chen",
    channel: "Platform Team",
    preview:
      "Sprint velocity report is ready. We're trending 15% above last quarter. Great work everyone! 📊",
    timestamp: "Yesterday 4:30 PM",
    mentions: false,
  },
];

export const demoDocuments: Document[] = [
  {
    id: "d1",
    title: "Customer Portal — Wireframes v3.pdf",
    sharedBy: "Anna Kowalski",
    sharedAt: "Today 8:30 AM",
    type: "PDF",
    url: "#",
  },
  {
    id: "d2",
    title: "Q3 Cloud Infrastructure Costs.xlsx",
    sharedBy: "David Kim",
    sharedAt: "Today 7:00 AM",
    type: "Excel",
    url: "#",
  },
  {
    id: "d3",
    title: "Platform Migration — Risk Assessment.docx",
    sharedBy: "Robert Chang",
    sharedAt: "Yesterday 6:00 PM",
    type: "Word",
    url: "#",
  },
  {
    id: "d4",
    title: "Sprint 24 Velocity Report.pptx",
    sharedBy: "Sarah Chen",
    sharedAt: "Yesterday 4:30 PM",
    type: "PowerPoint",
    url: "#",
  },
  {
    id: "d5",
    title: "Security Audit Q3 — Findings.pdf",
    sharedBy: "IT Security Team",
    sharedAt: "Yesterday 4:15 PM",
    type: "PDF",
    url: "#",
  },
];

export const demoCommitments: Commitment[] = [
  {
    id: "c1",
    description: "Send updated cloud infrastructure cost breakdown to CFO before 10 AM",
    source: "Email from Jennifer Walsh",
    dueDate: "Today 10:00 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: "c2",
    description: "Review and respond to platform migration timeline concerns",
    source: "Email from Robert Chang",
    dueDate: "Today EOD",
    priority: "high",
    status: "pending",
  },
  {
    id: "c3",
    description: "Review customer portal wireframes before design meeting",
    source: "Teams message from Anna Kowalski",
    dueDate: "Today 1:00 PM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "c4",
    description: "Add team updates to all-hands deck (slides 12-15)",
    source: "Teams message from David Kim",
    dueDate: "Tomorrow EOD",
    priority: "medium",
    status: "pending",
  },
  {
    id: "c5",
    description: "Respond to security audit findings (2 medium-severity items)",
    source: "Email from IT Security Team",
    dueDate: "Friday EOD",
    priority: "medium",
    status: "pending",
  },
  {
    id: "c6",
    description: "Make decision on CloudSync vendor contract renewal",
    source: "Email from CloudSync",
    dueDate: "Friday",
    priority: "high",
    status: "pending",
  },
];
