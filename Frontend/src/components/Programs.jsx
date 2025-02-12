

const Programs = () => {
  return (
    <section className="py-16 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#311840]">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-[#311840]">Education and Literacy</h3>
            <p className="mt-2">Providing access to quality education for children and adults.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-[#311840]">Healthcare</h3>
            <p className="mt-2">Ensuring health and family welfare through medical camps and awareness programs.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-[#311840]">Vocational Training</h3>
            <p className="mt-2">Offering skills development programs to enhance employment opportunities.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-[#311840]">Rural and Urban Development</h3>
            <p className="mt-2">Working on sustainable development initiatives in both rural and urban areas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
