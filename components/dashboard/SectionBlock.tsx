const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md p-6 animate-slide-up">
    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
    {children}
  </section>
);

export default SectionBlock;
