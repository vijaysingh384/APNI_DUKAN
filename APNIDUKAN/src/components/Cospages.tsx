// Navbar moved to app-level router layout (App.tsx)
import Hero from './Hero';
import Features from './Features';
import Demo from './Demo';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from './Footer';

function Copages(){
    return(
      <>
      <main>
        <section id="home" className="pt-8">
          <Hero />
        </section>

        <section id="products" className="py-20">
          <Features />
        </section>

        {/* <section id="how-it-works" className="py-20 bg-gray-50">
          <HowItWorks />
        </section> */}

        <section id="for-shopkeepers" className="py-20">
          <Demo />
        </section>

        <section id="testimonials" className="py-20 bg-gray-50">
          <Testimonials />
        </section>

        {/* <section id="pricing" className="py-20">
          <Pricing />
        </section> */}

        <section id="faq" className="py-20 bg-gray-50">
          <FAQ />
        </section>

        <section id="contact" className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold">Contact</h3>
            <p className="mt-2 text-gray-600">Have questions or want help getting started? Email us at <a className="text-orange-600" href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
        </section>
      </main>

      <Footer />
      </>
    );
}

export default Copages;

