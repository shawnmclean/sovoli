export function MissionVisionSection() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 text-3xl font-bold">
          Our Mission, Vision, and Core Values
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Mission</h3>
            <p className="text-default-600">
              To provide a nurturing environment that fosters academic
              excellence, character development, and lifelong learning.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Vision</h3>
            <p className="text-default-600">
              To be a leader in transformative education, empowering students to
              achieve their highest potential.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Core Values</h3>
            <ul className="space-y-2 text-default-600">
              <li>- Integrity and Respect</li>
              <li>- Academic Excellence</li>
              <li>- Creativity and Innovation</li>
              <li>- Community Engagement</li>
              <li>- Lifelong Learning</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
