/**
 * Server-rendered "About the book" panel. The storybook is a full-viewport
 * client experience, so this gives readers and search engines real text:
 * H1, description, author bio and FAQ. Uses <details>, so it works without JS.
 */
export const FAQ = [
  {
    q: "What age is Granny on the Go Adventures for?",
    a: "It is a full-color picture book for children ages 3 to 8, made for reading aloud together.",
  },
  {
    q: "What is Granny on the Go Adventures about?",
    a: "Granny arrives in her little black convertible, wearing her adventure cap and carrying her colorful tote full of bubbles, chalk, jump ropes, books and surprises. Her greatest gift isn't what's inside the tote. It's how she notices children, so that at the end of the day they remember that someone saw something special inside them.",
  },
  {
    q: "Who wrote Granny on the Go Adventures?",
    a: "Haley Schumacher, a mother of four living in the Las Vegas area. The book grew from the adventures her children had with the real-life inspiration for Granny.",
  },
  {
    q: "Who inspired the character of Granny?",
    a: "Granny is inspired by Edie, a beloved babysitter who encouraged children through curiosity, kindness and adventure.",
  },
];

export default function AboutBook() {
  return (
    <details className="about-book">
      <summary>About the book</summary>
      <div className="about-book__panel">
        <h1>Granny on the Go Adventures: A Grandma Picture Book for Ages 3 to 8</h1>
        <p>
          <strong>Granny on the Go Adventures</strong> is a full-color picture book by Haley
          Schumacher about a grandma figure who turns ordinary days into extraordinary
          adventures. She rolls into the driveway in a little black convertible, wearing her
          adventure cap and carrying a colorful tote. It isn&apos;t fancy and it isn&apos;t
          loud, but somehow it looks like adventure.
        </p>
        <p>
          It is a story about love, adventure and the little things that mean the most, and
          about the grown-ups who make a child feel truly seen. A warm read-aloud for
          grandparents, parents and caregivers to share with children ages 3 to 8.
        </p>
        <h2>About the author</h2>
        <p>
          Haley Schumacher is a mother of four living in the Las Vegas area. Granny on the Go
          Adventures grew from the adventures her children experienced with the real-life
          inspiration for Granny: Edie, a beloved babysitter who encouraged children through
          curiosity, kindness and adventure.
        </p>
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
        <p>
          Questions? Email{" "}
          <a href="mailto:GrannyOnTheGoBooks@gmail.com">GrannyOnTheGoBooks@gmail.com</a>.
        </p>
      </div>
    </details>
  );
}
