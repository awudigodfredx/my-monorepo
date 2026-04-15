import React, { Suspense, useEffect, useState } from "react";
import DynamicRenderer from "../components/DynamicRenderer";
import Modal from "../components/Modal";

// ← expanded to cover all config shapes (old cards + new panels)
interface DashboardConfig {
  id: number;
  componentType: string;
  title?: string;
  description?: string;
  content?: string;
  onClickType?: string;
  // new fields for analytics panels
  eventKey?: string;
  label?: string;
}

const Dashboard: React.FC = () => {
  const [sections, setSections] = useState<DashboardConfig[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  useEffect(() => {
    import("../config/dashboard.json").then((data) =>
      setSections(data.default as DashboardConfig[]),
    );
  }, []);

  const handleSectionClick = (section: DashboardConfig) => {
    if (section.onClickType === "modal") {
      setModalContent({
        title: section.title ?? "",
        content: section.description ?? "",
      });
      setModalOpen(true);
    }
  };

  return (
    <main>
      <section className="min-h-screen flex flex-col pb-20 max-w-7xl mx-auto">
        <div className="p-6 mt-24 mb-8">
          <h1
            className="font-display text-3xl uppercase tracking-tight"
            data-testid="dashboard-heading"
          >
            Dashboard
          </h1>
        </div>
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={null}>
            {sections.map((section) => (
              <DynamicRenderer
                key={section.id}
                componentName={section.componentType}
                props={{
                  ...section,
                  onClick: () => handleSectionClick(section),
                }}
              />
            ))}
          </Suspense>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={modalContent.title}
            content={modalContent.content}
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
