import React from 'react';
import './Panel.css';

const Panel = ({ title, children }) => {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

export default Panel;
