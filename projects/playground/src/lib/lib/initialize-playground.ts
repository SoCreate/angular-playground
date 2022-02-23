
export const initializePlayground = (elementNameToReplace?: string, htmlTitle: string = 'Playground') => {
    document.getElementsByTagName('title')[0].innerHTML = htmlTitle;
    if (elementNameToReplace && elementNameToReplace.length > 0) {
        let appNode = document.getElementsByTagName(elementNameToReplace)[0];
        if (!appNode) {
            throw new Error(`Your configured selector (${elementNameToReplace}) does not match your app root selector.`);
        }
        appNode.parentNode.replaceChild(document.createElement('playground-app'), appNode);
    }
    let resetStyles = `
    // Playground reset styles
    html {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    body {
      margin: 0;
    }
  `;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(resetStyles));
    document.head.insertBefore(style, document.head.firstChild);
};
