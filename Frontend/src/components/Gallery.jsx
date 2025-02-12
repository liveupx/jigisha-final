
const Gallery = () => {
  return (
    <section className="py-16 px-6 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#311840]">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="overflow-hidden rounded-lg shadow-md">
            <img src="/images/gallery1.jpg" alt="Gallery 1" className="w-full h-48 object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg shadow-md">
            <img src="/images/gallery2.jpg" alt="Gallery 2" className="w-full h-48 object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg shadow-md">
            <img src="/images/gallery3.jpg" alt="Gallery 3" className="w-full h-48 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
