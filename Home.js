import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  axios.get('http://localhost:5000/api/products?featured=true')
    .then(res => setProducts(res.data))
    .catch(console.error);
}, []);


  const carouselSlides = [
    {
      image: '/assets/carousel/Mandala1.jpg',
      title: 'Welcome to Mandala',
      subtitle: 'Discover handcrafted mandala art that brings peace, harmony, and beauty into your space.'
    },
    {
      image: '/assets/carousel/Mandala2.jpg',
      title: 'The Perfect Gift',
      subtitle: 'Find a meaningful and beautiful gift for your loved ones.'
    },
    {
      image: '/assets/carousel/Mandala3.jpg',
      title: 'Unique Custom Orders',
      subtitle: 'Bring your vision to life. We create personalized mandalas just for you.'
    },
  ];

  const [slide, setSlide] = useState(0);
  const next = () => setSlide(i => (i === carouselSlides.length - 1 ? 0 : i + 1));
  const prev = () => setSlide(i => (i === 0 ? carouselSlides.length - 1 : i - 1));

  useEffect(() => {
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="">
   <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
  {carouselSlides.map((slideData, i) => (
    <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
    >
      <img
        src={slideData.image}
        alt={slideData.title}
        className="w-full h-full object-cover object-center brightness-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white z-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3 drop-shadow-lg animate-fade-in">
          {slideData.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-semibold max-w-xl drop-shadow-md animate-fade-in delay-300">
          {slideData.subtitle}
        </p>
      </div>
    </div>
  ))}

  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black text-xl font-bold p-2 rounded-full z-30 shadow-md">
    ‹
  </button>
  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black text-xl font-bold p-2 rounded-full z-30 shadow-md">
    ›
  </button>

  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
    {carouselSlides.map((_, i) => (
      <button
        key={i}
        onClick={() => setSlide(i)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${i === slide ? 'bg-orange-500 scale-125' : 'bg-white/60'}`}
      />
    ))}
  </div>
</section>


      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">Featured Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="mt-16 text-center">
            <Link to="/products" className="border-2 border-orange-500 text-orange-500 font-bold py-3 px-8 rounded-full hover:bg-orange-500 hover:text-white">
              View All Products
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
