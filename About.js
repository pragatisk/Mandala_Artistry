import React from "react";

function About() {
  return (
    <div className=" bg-gray-50">
      <section className=" bg-IMG1 relative h-[300px] sm:h-[400px] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">
              Meet the Artist Behind Artful Mandala
            </h1>
            <p className="text-sm sm:text-base">
              Discover the passion, tradition, and creativity woven into every piece of Mandala art.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-12 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <h2 className="text-amber-600 text-xl sm:text-2xl font-semibold mb-4">
            My Journey with Mandala Art
          </h2>
          <p className="text-gray-700 text-base mb-4">
            Mandala art is more than just a creative expression for me — it's a spiritual practice that brings balance and harmony. My journey began with a deep admiration for sacred geometry and its connection to the universe.
          </p>
          <p className="text-gray-700 text-base">
            Every stroke and pattern is infused with passion and a desire to share the serenity Mandalas bring. Inspired by ancient traditions and spiritual experiences, I founded Artful Mandala to bring these designs into homes and hearts.
          </p>
        </div>

        <div className="md:w-1/2">
          <img
            src="/assets/hero.jpg"
            alt="Mandala Art"
            className="rounded-xl shadow-lg w-[60%] mx-auto object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-12 px-5 sm:px-10 text-center">
        <h2 className="text-amber-600 text-xl sm:text-2xl font-semibold mb-10">
          Our Core Values
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Handmade with Love",
              text: "Each Mandala is crafted with precision, patience, and heartfelt appreciation for the art form.",
            },
            {
              title: "Inspired by Tradition",
              text: "Rooted in ancient symbolism, our designs reflect balance, harmony, and deep spirituality.",
            },
            {
              title: "Sustainable Materials",
              text: "We use eco-conscious materials to ensure our art nurtures both the soul and the planet.",
            },
          ].map((val, i) => (
            <div
              key={i}
              className="bg-[#f9f9f9] p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{val.title}</h3>
              <p className="text-sm text-gray-600">{val.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
