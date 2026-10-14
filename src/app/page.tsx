import BookExperience from "@/components/book/BookExperience";
import AboutBook from "@/components/AboutBook";

/**
 * The site is the book.
 * Cover → open → turn pages through the story.
 * AboutBook adds server-rendered text (H1, description, author, FAQ).
 */
export default function Home() {
  return (
    <>
      <BookExperience />
      <AboutBook />
    </>
  );
}
