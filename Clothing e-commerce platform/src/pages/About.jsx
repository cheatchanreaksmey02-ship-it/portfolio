export default function About() {
  return (
    <>
      <section id="page-header" className="about-header">
        <h2>Get to Know Us</h2>
        <p>Learn more about our journey and what inspires our designs!</p>
      </section>

      <section id="about-header">
        <img src={`${import.meta.env.BASE_URL}img/about/a6.jpg`} alt="Who We Are" />
        <div>
          <h2>Who We Are?</h2>
          <p>
            We are a fashion-focused platform created to help you express your style with confidence.
            Our goal is to make fashion easy and inspiring by sharing outfit ideas, color combination tips,
            styling advice, and common fashion do's and don'ts. Whether you're dressing for everyday life
            or special occasions, we guide you to create looks that are modern, balanced, and uniquely yours.
          </p>
        </div>
      </section>
    </>
  );
}
