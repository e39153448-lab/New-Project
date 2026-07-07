export const LEVELS = [
  "Kindergarten Readiness",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
] as const;

export const GRADE_OPTIONS = [
  "Pre-K",
  "Kindergarten Readiness",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
];

export const FACILITATOR_TYPES = [
  { value: "parent", label: "Parent" },
  { value: "nanny", label: "Nanny" },
  { value: "grandparent", label: "Grandparent" },
  { value: "au_pair", label: "Au Pair" },
  { value: "other", label: "Other Caregiver" },
];

export const GOALS = [
  { value: "enrichment", label: "Enrichment" },
  { value: "school_readiness", label: "School Readiness" },
  { value: "math_confidence", label: "Math Confidence" },
  { value: "homeschool_support", label: "Homeschool Support" },
  { value: "structured_caregiver_time", label: "Something Structured for Caregiver Time" },
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export const CALENDLY_URL =
  process.env.CALENDLY_URL ?? "https://calendly.com/rocketclub/call";

export const MEMBERSHIP_PRICE = 150;

export function formatMembershipStatus(status: string) {
  const map: Record<string, string> = {
    inquiry: "Inquiry",
    free_trial: "Free Trial",
    active: "Active",
    past_due: "Past Due",
    canceled: "Canceled",
  };
  return map[status] ?? status;
}

export function formatStatus(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
