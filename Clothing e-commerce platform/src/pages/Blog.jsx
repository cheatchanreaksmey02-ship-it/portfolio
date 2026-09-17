const posts = [
  { img: 'b1.jpg', title: 'Best Outfits for Different Occasions', text: 'Discover stylish outfit ideas for every occasion, from casual outings to special events. Learn how to dress confidently and appropriately while expressing your personal style.' },
  { img: 'b2.jpg', title: 'Fashion Color Combinations Guide', text: 'Learn simple ways to match colors in your outfits to look stylish, balanced, and confident for any occasion.' },
  { img: 'b3.jpg', title: 'How to Style a Casual Outfit', text: 'Discover easy tips to create relaxed yet stylish everyday looks by mixing comfortable clothing with simple, trendy pieces.' },
  { img: 'b4.jpg', title: 'Accessories That Complete Your Look', text: 'Learn how to choose the right accessories like bags, jewelry, and shoes to enhance your outfit and add a stylish finishing touch.' },
  { img: 'b5.jpg', title: 'Top Fashion Mistakes to Avoid', text: 'Avoid common style errors like over-accessorizing, wearing ill-fitting clothes, or mismatching colors, and learn how to create cleaner, more balanced outfits.' },
];

export default function Blog() {
  return (
    <>
      <section id="page-header" className="blog-header">
        <h2>Read More</h2>
        <p>Read all case studies about our products!</p>
      </section>

      <section id="blog">
        {posts.map(post => (
          <div className="blog-box" key={post.title}>
            <div className="blog-img">
              <img src={`${import.meta.env.BASE_URL}img/blog/${post.img}`} alt="" />
            </div>
            <div className="blog-details">
              <h4>{post.title}</h4>
              <p>{post.text}</p>
              <a href="#">CONTINUE READING</a>
            </div>
          </div>
        ))}
      </section>

      <section id="pagination" className="section-p1">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#"><i className="fal fa-long-arrow-alt-right"></i></a>
      </section>
    </>
  );
}
