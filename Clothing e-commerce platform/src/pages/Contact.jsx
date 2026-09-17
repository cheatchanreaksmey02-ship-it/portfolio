import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('Sending…');
    const { error } = await supabase.from('messages').insert({ ...form, status: 'unread' });
    if (error) { setStatus(error.message); return; }
    setStatus('Message sent — thank you!');
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>Let's Talk</h2>
        <p>LEAVE A MESSAGE. We love to hear from you!</p>
      </section>

      <section id="contact-details" className="section-p1">
        <div className="details">
          <span>GET IN TOUCH</span>
          <h2>Visit one of our agency locations or contact us today</h2>
          <h3>Head Office</h3>
          <div>
            <li><i className="fal fa-map"></i><p>No. 562, St 32, BKK, Phnom Penh</p></li>
            <li><i className="fal fa-envelope"></i><p>carafashion168@gmail.com</p></li>
            <li><i className="fal fa-phone-alt"></i><p>(+85) 12 345 678</p></li>
            <li><i className="fal fa-clock"></i><p>Monday to Saturday: 8:00am to 17:00pm</p></li>
          </div>
        </div>
        <div className="map">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62528.635615834624!2d104.8828671!3d11.620518299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095164d2225201%3A0xfb519c28c65b0b3f!2sA.N.D!5e0!3m2!1sen!2skh!4v1782337743510!5m2!1sen!2skh"
            width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </section>

      <section id="form-details">
        <form onSubmit={handleSubmit}>
          <span>LEAVE A MESSAGE</span>
          <h2>We love to hear from you</h2>
          <p style={{ minHeight: 20 }}>{status}</p>
          <input type="text" placeholder="Your Name" required value={form.name} onChange={e => update('name', e.target.value)} />
          <input type="email" placeholder="E-mail" required value={form.email} onChange={e => update('email', e.target.value)} />
          <input type="text" placeholder="Subject" value={form.subject} onChange={e => update('subject', e.target.value)} />
          <textarea cols="30" rows="10" placeholder="Your Message" required value={form.message} onChange={e => update('message', e.target.value)}></textarea>
          <button type="submit" className="normal">Submit</button>
        </form>
      </section>
    </>
  );
}
