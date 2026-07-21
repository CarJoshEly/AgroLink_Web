"use client";

import { useState, ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export default function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <div>
      <div className="flex gap-6 border-b border-forest-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              active === tab.id ? "text-forest-800" : "text-soil-400 hover:text-forest-600"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-forest-700 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}
