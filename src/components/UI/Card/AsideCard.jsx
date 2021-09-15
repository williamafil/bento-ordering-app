import React from "react";

const AsideCard = ({ children, label }) => {
  return (
    <section className="mb-2">
      <h3 className="px-4 py-2 bg-black text-white font-semibold inline-block">
        {label}
      </h3>
      <div className="border border-black p-3">{children}</div>
    </section>
  );
};

export default AsideCard;
