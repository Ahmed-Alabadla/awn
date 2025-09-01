"use client";

export default function AboutSection() {
  return (
    <section className="py-16 px-6" id="about">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          About <span className="text-teal-600">Awn</span>
        </h2>

        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          We are a bridge connecting compassionate institutions with individuals
          and communities who need support. Our platform facilitates meaningful
          connections that create lasting impact.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="border rounded-lg shadow-sm p-6 text-center bg-white hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 text-teal-600 rounded-full p-3">❤️</div>
          </div>
          <h3 className="text-2xl font-bold text-teal-600">500+</h3>
          <p className="text-gray-500">Partner Institutions</p>
        </div>

        {/* Card 2 */}
        <div className="border rounded-lg shadow-sm p-6 text-center bg-white hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-600 rounded-full p-3">
              👥
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-600">10K+</h3>
          <p className="text-gray-500">Lives Impacted</p>
        </div>

        <div className="border rounded-lg shadow-sm p-6 text-center bg-white hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3">🌍</div>
          </div>
          <h3 className="text-2xl font-bold text-blue-600">50+</h3>
          <p className="text-gray-500">Cities Served</p>
        </div>

        {/* Card 4 */}
        <div className="border rounded-lg shadow-sm p-6 text-center bg-white hover:shadow-md transition">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 text-red-600 rounded-full p-3">⚡</div>
          </div>
          <h3 className="text-2xl font-bold text-red-600">24/7</h3>
          <p className="text-gray-500">Support Available</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-left">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed">
          To eliminate barriers between those who can help and those who need
          help. We believe that everyone deserves access to essential resources
          – whether it&#39;s medical care, education, food security, or
          emergency assistance.
        </p>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Through our platform, we&#39;ve created a trusted ecosystem where
          verified institutions can efficiently reach those in need, and
          individuals can access life-changing support from reputable
          organizations.
        </p>
      </div>
    </section>
  );
}
