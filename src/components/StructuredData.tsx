export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://grannyonthegoadventures.com/#website",
        url: "https://grannyonthegoadventures.com",
        name: "Granny on the Go Adventures",
        description:
          "The official home of Granny on the Go — a children's book brand about curiosity, courage, and everyday wonder.",
        publisher: { "@id": "https://grannyonthegoadventures.com/#author" },
        inLanguage: "en-US",
      },
      {
        "@type": "Book",
        "@id": "https://grannyonthegoadventures.com/#book",
        name: "Granny on the Go",
        author: { "@id": "https://grannyonthegoadventures.com/#author" },
        description:
          "A story about love, adventure, and the little things that mean the most. Ordinary days become extraordinary when someone truly sees a child.",
        genre: "Children's literature",
        inLanguage: "en",
        bookFormat: "https://schema.org/Hardcover",
        image: "https://grannyonthegoadventures.com/images/book-cover.jpg",
        url: "https://grannyonthegoadventures.com",
      },
      {
        "@type": "Person",
        "@id": "https://grannyonthegoadventures.com/#author",
        name: "Haley Schumacher",
        jobTitle: "Author",
        description:
          "Mother of four living in the Las Vegas area and creator of Granny on the Go Adventures.",
        url: "https://grannyonthegoadventures.com/#meet-author",
        email: "GrannyOnTheGoBooks@gmail.com",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
