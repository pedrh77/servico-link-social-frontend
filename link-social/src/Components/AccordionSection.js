import React, { useState } from "react";
import "./Accordion.css";

export default function AccordionSection({ title, children, initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <section className="accordion-section">
      <button className="accordion-header" onClick={() => setExpanded(!expanded)}>
        {title}
      </button>
      {expanded && <div className="accordion-content">{children}</div>}
    </section>
  );
}
