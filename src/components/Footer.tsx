"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full p-4 text-center border-t bg-background">
      <a
        href="https://www.dyad.sh/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Made with Dyad
      </a>
    </footer>
  );
};

export default Footer;