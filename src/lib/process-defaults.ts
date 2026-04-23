/**
 * Industry-default process steps — rendered by ProcessSteps.astro when
 * `src/data/process.json` is absent (e.g. thin-social-data runs where
 * process-author couldn't ground real steps).
 *
 * Defaults cover the six industry buckets named in the platform process-author
 * skill (trade / restaurant / retail / service / author / other). Keep them
 * plausible but generic — the pipeline's grounded output should always be
 * preferred, and platform#682 guards against generic-verb boilerplate before
 * the skill emits process.json in the first place. Defaults are intentionally
 * kept out of that guard's reach (they only render when the skill did NOT
 * emit a file).
 *
 * Per platform#684 / template#100:
 *   - 3-5 steps per default set (matches skill schema min/max)
 *   - No em dashes (CLAUDE.md AI Content Guidelines — note: some existing
 *     copy uses them; new defaults here stay clean)
 *   - Commas / periods / "then" for pacing
 */

export type IndustryBucket =
  | 'trade'
  | 'restaurant'
  | 'retail'
  | 'service'
  | 'author'
  | 'other';

export interface DefaultProcessStep {
  title: string;
  description: string;
  order: number;
}

/**
 * Map the free-form `theme.json.industry` string (e.g. "Electrical Services",
 * "Window Tinting", "Italian Restaurant") to one of the six buckets used by
 * the process-author skill. Case-insensitive substring match; falls back to
 * `other`.
 *
 * The mapping is intentionally coarse — sites with unusual industries land in
 * `service` or `other`, which both render safe, plausible defaults.
 */
export function resolveIndustryBucket(industry?: string | null): IndustryBucket {
  const s = (industry || '').toLowerCase();
  if (!s) return 'other';

  // Author / creator is checked first: "Book Publisher" would otherwise match
  // the "pub" token in restaurant, and "Novelist Shop" would hit retail.
  if (/\bauthor\b|\bwriter\b|novelist|\bpoet\b|publish|\bspeaker\b|\bbook\b/.test(s)) {
    return 'author';
  }

  // Service is checked before retail/restaurant because "Barber Shop" and
  // "Salon Boutique" contain retail-keywords ("shop"/"boutique") but are
  // really professional-service businesses with appointment-style process.
  if (
    /\bsalon\b|barber|\bspa\b|massage|therapist|counselor|fitness|personal train|\byoga\b|pilates|photograph|\bdesign\b|marketing|consult|legal|\blaw\b|account|\btax\b|real estate|insurance|financial|medical|dental|\bvet\b|clinic/.test(
      s,
    )
  ) {
    return 'service';
  }

  // Trade: physical, skilled labor with an on-site visit and clean-up
  if (
    /electric|plumb|hvac|roof|paint|weld|tint|mason|concrete|landscap|garage|construct|contract|remodel|renovat|handyman|carpent|fence|drywall|flooring|solar|pest|\bpool\b|\btree\b|cleaning service|home improv|repair|install/.test(
      s,
    )
  ) {
    return 'trade';
  }

  // Restaurant: food service. `\b` boundaries on short words (e.g. "bar",
  // "pub", "grill", "deli") so they don't match inside "barber", "publisher",
  // "grille-maker", etc.
  if (
    /restaurant|cafe|café|coffee|bakery|pizzeria|diner|\bbar\b|brewery|catering|food truck|bistro|\bgrill\b|kitchen|eatery|\bdeli\b|taqueria|ramen|sushi|\bpub\b/.test(
      s,
    )
  ) {
    return 'restaurant';
  }

  // Retail: sells physical goods on site
  if (
    /retail|\bshop\b|\bstore\b|boutique|gallery|market|shopping|apparel|clothing|jewelry|furniture|bookshop|nursery|florist|\bgift\b/.test(
      s,
    )
  ) {
    return 'retail';
  }

  // Catch-all "service" word before falling through to other. This picks up
  // generic labels like "Cleaning Service" that weren't caught by the more
  // specific trade rule.
  if (/service/.test(s)) {
    return 'service';
  }

  return 'other';
}

/**
 * Industry-default process step sets. Each set has 3-4 plausible steps that
 * describe a generic customer journey for that bucket. These are fallbacks
 * only — the pipeline's grounded output (process.json) wins whenever present.
 */
export const DEFAULT_PROCESS_STEPS: Record<IndustryBucket, DefaultProcessStep[]> = {
  trade: [
    {
      title: 'Get in touch',
      description:
        'Reach out with a quick description of the job. We respond the same day with a free estimate.',
      order: 1,
    },
    {
      title: 'Schedule the work',
      description:
        'Pick a time that works for you. We confirm the window and arrive on time with the right crew and gear.',
      order: 2,
    },
    {
      title: 'On-site work',
      description:
        'Licensed and insured. We keep the workspace tidy and walk you through what we did before we leave.',
      order: 3,
    },
    {
      title: 'Follow up',
      description:
        'Quick check-in after the job to make sure everything is working the way it should.',
      order: 4,
    },
  ],
  restaurant: [
    {
      title: 'Place your order',
      description:
        'Order online, over the phone, or walk in. Our menu is updated with what is fresh that day.',
      order: 1,
    },
    {
      title: 'Fresh preparation',
      description:
        'Every plate is made to order. We cook with real ingredients, no shortcuts.',
      order: 2,
    },
    {
      title: 'Pickup or dine in',
      description:
        'Grab your order ready when promised, or settle in and eat with us in the dining room.',
      order: 3,
    },
  ],
  retail: [
    {
      title: 'Browse the selection',
      description:
        'Stop in or scroll our site. Inventory turns often so there is always something new.',
      order: 1,
    },
    {
      title: 'Try it out',
      description:
        'We help you find the right fit or piece. No pressure, no gimmicks, just honest advice.',
      order: 2,
    },
    {
      title: 'Take it home',
      description:
        'Clear pricing at checkout. Returns are straightforward if it is not the right fit.',
      order: 3,
    },
  ],
  service: [
    {
      title: 'Book a time',
      description:
        'Reach out to check availability. We confirm your appointment and send a reminder before the visit.',
      order: 1,
    },
    {
      title: 'Your appointment',
      description:
        'Start with a quick conversation about what you need, then we get to work.',
      order: 2,
    },
    {
      title: 'Stay in touch',
      description:
        'Follow up with any questions any time. Most regulars book their next visit before they leave.',
      order: 3,
    },
  ],
  author: [
    {
      title: 'Discover the work',
      description:
        'Browse current and upcoming titles, read excerpts, and find where to buy.',
      order: 1,
    },
    {
      title: 'Read or listen',
      description:
        'Available in the formats you prefer, with details on each edition and release.',
      order: 2,
    },
    {
      title: 'Stay connected',
      description:
        'Sign up for news on new releases, events, and appearances.',
      order: 3,
    },
  ],
  other: [
    {
      title: 'Get in touch',
      description:
        'Send over the details of what you are looking for. We respond quickly with next steps.',
      order: 1,
    },
    {
      title: 'Plan together',
      description:
        'We walk through the options with you so the plan fits your situation.',
      order: 2,
    },
    {
      title: 'Get it done',
      description:
        'We handle the work end to end and keep you in the loop along the way.',
      order: 3,
    },
  ],
};

/**
 * Resolve default steps for an industry string. Combines bucket mapping and
 * default lookup.
 */
export function resolveDefaultProcessSteps(
  industry?: string | null,
): DefaultProcessStep[] {
  return DEFAULT_PROCESS_STEPS[resolveIndustryBucket(industry)];
}
