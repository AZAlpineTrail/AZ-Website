import styles from "./RiderTestimonials.module.css";

const testimonials = [
  {
    name: "Tim Adams",
    quote: "The Scenery is beautiful and views that are breath taking.",
    source: "https://www.youtube.com/watch?v=XOSrv_NlCT8",
  },
  {
    name: "Kim Krause",
    quote: "We experienced Eastern Arizona, explored the White Mountains, rode the Arizona Alpine Trail and created something truly special together.",
    source: "https://www.xpeditionforums.com/threads/arizona-alpine-trail-730-miles-lead-by-polaris-xpedition.1517/",
  },
  {
    name: "Bob Sands",
    quote: "Just completed the Alpine Loop. Made a 6 day ride out of it. Stayed at some great places. … Was a great ride",
    source: "https://www.facebook.com/groups/1324603116216826/posts/1438599154817221/",
  },
];

/* THESIS: Three real rider voices connect the map and itineraries with room to breathe.
   OWN-WORLD: Continuous dark forest surface, paper type, gold quotation marks, quiet names.
   STORY: Riders recognize scenery, shared adventure, and a completed multi-day journey.
   FIRST VIEWPORT: Tim, Kim, Bob in aligned open columns with generous spacing and matching type.
   FORM: Extend AZAT's existing palette with the supplied reference's quote-led composition. */
export function RiderTestimonials() {
  return (
    <section id="testimonials" aria-label="Rider testimonials" className={styles.section}>
      <div className={styles.quotes}>
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className={styles.testimonial}>
            <span aria-hidden="true" className={styles.quotationMark}>“</span>
            <blockquote cite={testimonial.source} className={styles.quote}>
              <p>{testimonial.quote}<span aria-hidden="true">”</span></p>
            </blockquote>
            <figcaption className={styles.byline}>
              <p className={styles.author}>{testimonial.name}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
