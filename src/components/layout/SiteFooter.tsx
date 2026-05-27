import React from "react";

const SiteFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="site-footer__text bricolage-grotesque">
        © {year} La Wun So So — Full Stack Developer
      </p>
    </footer>
  );
};

export default SiteFooter;
