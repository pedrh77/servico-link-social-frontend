import React, { useState } from "react";
import "./Accordion.css";

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="accordion-section">
      <button 
        className="accordion-header" 
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {title}
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </section>
  );
}