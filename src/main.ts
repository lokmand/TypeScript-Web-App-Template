/* Check if the browser has WebP support, if it does, the class "webp" wil be
 * added to the <html> tag. If the browser does not support WebP - it will add
 * the class "no-webp" to the tag instead.
*/
(() => {
  const img = new Image();

  /* Set classes to determine which pics to load */
  const html_element: Element = document.getElementsByTagName("html")[0];

  /* Helper function to keep it DRY */
  function webp_class(ele: Element, webp_support: boolean) {
    if (webp_support) {
      ele.classList.add("webp");
    } else {
      ele.classList.add("no-webp");
    }
  }

  img.onload = () => {
    const webp_support = !!(img.height > 0 && img.width > 0);
    webp_class(html_element, webp_support);
  };

  img.onerror = () => {
    webp_class(html_element, false);
  };

  img.src = "img/test_pixel.webp";
})();
