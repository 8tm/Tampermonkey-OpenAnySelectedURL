# Tampermonkey script - OpenAnySelectedURL

## This script will open all URLs found in the selected text using Ctrl + Escape.

Content:

```javascript

// ==UserScript==
// @name        OpenAnySelectedURL
// @version     25.5.4
// @description Open all URLs found in the selected text using Ctrl + Escape.
// @author      8TM (https://github.com/8tm/Tampermonkey-OpenAnySelectedURL)
// @match       *://*/*
// @compatible  firefox Works with Firefox and Tampermonkey
// @grant       GM_openInTab
// @namespace   https://greasyfork.org/users/1386567
// ==/UserScript==

(() => {
  'use strict';

  // Simple regex for detecting URLs
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

  // Common function for handling an element or the current selection
  function handleOpen(target) {
    let targetUrl = null;

    // Retrieve the selected text and trim leading/trailing whitespace
    const sel = window.getSelection().toString().trim();
    if (!sel) return;

    // Locate all URLs in the text
    const matches = sel.match(/(https?:\/\/\S+|www\.[^\s]+)/ig);
    if (matches && matches.length > 0) {
      // Normalize and filter out only valid/openable URLs
      const urls = matches
        .map(str => normalizeUrl(str))
        .filter(u => u);
      // Open each URL in the background
      urls.forEach(u => {
        GM_openInTab(u, true);
      });
    }
  }

  // Keyboard shortcut: Ctrl + Escape
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && event.key === 'Escape') {
      e.preventDefault();
      handleOpen(document.activeElement);
    }
  });

})();

```