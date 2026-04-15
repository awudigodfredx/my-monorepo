// apps/frontend/src/components/widgets/ModalOpensPanel.tsx
import React, { useEffect, useState } from "react";

interface ModalBreakdown {
  modal: string;
  opens: number;
}
interface ModalOpensData {
  total: number;
  byModal: ModalBreakdown[];
}

const ModalOpensPanel: React.FC = () => {
  const [data, setData] = useState<ModalOpensData | null>(null);

  useEffect(() => {
    import("../../config/analyticsData.json").then((d) =>
      setData(d.default.modalOpens),
    );
  }, []);

  if (!data) return null;

  return (
    <div
      className="bg-white border-2 border-brand-primary p-6
                 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
      data-testid="modal-opens-panel"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
        Modal opens
      </p>
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="text-4xl font-display font-bold"
          data-testid="modal-opens-total"
        >
          {data.total}
        </span>
      </div>
      <div className="space-y-2">
        {data.byModal.map((m) => (
          <div key={m.modal} className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-gray-500">
              {m.modal.replace(/_/g, " ")}
            </span>
            <span
              className="text-xs font-mono font-bold"
              data-testid={`modal-opens-${m.modal}`}
            >
              {m.opens}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalOpensPanel;
