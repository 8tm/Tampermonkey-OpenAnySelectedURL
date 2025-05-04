// ==UserScript==
// @name        OpenAnySelectedURL
// @version     25.5.4
// @description Open all unique URLs found in the selected text using Ctrl + Escape.
// @author      8TM (https://github.com/8tm/Tampermonkey-OpenAnySelectedURL)
// @license     CC-BY-NC-4.0
// @icon        https://raw.githubusercontent.com/8tm/Tampermonkey-OpenAnySelectedURL/4cf59b8545017d6358ffb7e02a933e3d2929f346/icon.png
// @match       *://*/*
// @compatible  firefox
// @grant       GM_openInTab
// @namespace   https://greasyfork.org/users/1386567
// ==/UserScript==

(() => {
  'use strict';

  // Simple regex for detecting URLs (used only in normalizeUrl)
  const urlPattern = /^(https?:\/\/[\S]+)|(www\.[^\s]+)/i;

  // Normalizes and auto-completes the protocol if missing (www → http://www)
  function normalizeUrl(str) {
    let url = str.trim();
    if (!/^https?:\/\//i.test(url)) {
      if (/^www\./i.test(url)) {
        url = 'http://' + url;
      } else {
        return null;
      }
    }
    return url;
  }

  // Common function for handling the current selection
  function handleOpen() {
    const sel = window.getSelection().toString().trim();
    if (!sel) return;

    // Locate all URLs in the text, excluding surrounding parentheses, quotes or angle brackets
    const matches = sel.match(/(https?:\/\/[^\s\(\)'\"<>]+|www\.[^\s\(\)'\"<>]+)/ig);
    if (!matches) return;

    // Normalize, filter out invalid and dedupe
    const urls = Array.from(new Set(
      matches
        .map(u => normalizeUrl(u))
        .filter(u => u)
    ));

    // Open each URL in the background
    urls.forEach(u => {
      GM_openInTab(u, true);
    });
  }

  // Keyboard shortcut: Ctrl + Escape
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Escape') {
      e.preventDefault();
      handleOpen();
    }
  });

})();
