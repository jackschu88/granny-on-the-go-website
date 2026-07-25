export type BookPageId =
  | "hero"
  | "meet-granny"
  | "heart-of-story"
  | "inspiration"
  | "peek-adventure"
  | "meet-author"
  | "coming-soon"
  | "contact"
  | "closing";

export type BookPageDef = {
  id: BookPageId;
  /** Chapter label shown as page title / progress */
  title: string;
  /** Short line under the title on the paper */
  kicker?: string;
};

/**
 * Story order after the cover opens.
 * These are pages in the book — not website tabs.
 */
export const BOOK_PAGES: BookPageDef[] = [
  {
    id: "hero",
    title: "Welcome",
    kicker: "Where every ordinary day becomes a story worth remembering.",
  },
  {
    id: "meet-granny",
    title: "Meet Granny",
    kicker: "She sees what children can become.",
  },
  {
    id: "heart-of-story",
    title: "The Heart of the Story",
    kicker: "Every adventure begins with something wonderfully simple.",
  },
  {
    id: "inspiration",
    title: "The Inspiration",
    kicker: "Like every meaningful story, Granny began with someone real.",
  },
  {
    id: "peek-adventure",
    title: "Peek Into the Adventure",
    kicker: "A few moments waiting inside the pages…",
  },
  {
    id: "meet-author",
    title: "Meet the Author",
    kicker: "Mother. Storyteller. Believer in childhood.",
  },
  {
    id: "coming-soon",
    title: "Pre-Order",
    kicker: "Be among the first families to welcome Granny home.",
  },
  {
    id: "contact",
    title: "Contact",
    kicker: "Let's begin an adventure together.",
  },
  {
    id: "closing",
    title: "The Last Page",
    kicker: "Today was a very good adventure.",
  },
];

export const TOTAL_PAGES = BOOK_PAGES.length;
