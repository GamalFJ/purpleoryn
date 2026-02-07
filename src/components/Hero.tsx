import heroBanner from "@/assets/hero-banner.png";

const Hero = () => {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-8 px-4 sm:px-6">
      <div className="container mx-auto relative z-10 w-full max-w-full px-0">
        <div className="w-full max-w-5xl mx-auto">
          <img
            src={heroBanner}
            alt="Gamal Jastram - I help businesses scale with AI. Web Development, Automation, Custom Apps & Tools."
            className="w-full h-auto rounded-xl sm:rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
