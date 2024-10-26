export const KnowledgeLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="flex-1">
      <h1>Knowledge</h1>
      {children}
    </main>
  );
};
