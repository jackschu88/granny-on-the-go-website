export default function Footer() {
  return (
    <footer className="bg-deep-burgundy/5 border-t border-warm-beige py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg text-deep-burgundy mb-3">
              Granny on the Go
            </h3>
            <p className="font-sans text-sm text-charcoal/50 max-w-xs">
              Where ordinary days become extraordinary adventures.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold text-charcoal/70 mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Meet Granny", href: "#meet-granny" },
                { label: "The Story", href: "#heart-of-story" },
                { label: "Coming Soon", href: "#coming-soon" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-charcoal/50 hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold text-charcoal/70 mb-3 uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:GrannyOnTheGoBooks@gmail.com"
                  className="font-sans text-sm text-charcoal/50 hover:text-terracotta transition-colors"
                >
                  GrannyOnTheGoBooks@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-warm-beige pt-6 text-center">
          <p className="font-sans text-xs text-charcoal/40">
            &copy; {new Date().getFullYear()} Granny on the Go Adventures. 
            All rights reserved. Created with love by Haley Schumacher.
          </p>
        </div>
      </div>
    </footer>
  );
}
