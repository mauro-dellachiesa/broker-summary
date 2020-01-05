const init_bmb = (dialogEl) => {
    const ts = new Date().getTime();
    fetch(`https://www.bullmarketbrokers.com/Information/StockPrice/GetStockPrices?_ts=${ts}&term=3&index=usd+soberanos&sortColumn=ticker&isAscending=true`,
{"credentials":"include",
"headers":{
    "accept":"*/*",
    "accept-language":"en-US,en;q=0.9,es-AR;q=0.8,es;q=0.7",
    "cache-control":"no-cache",
    "pragma":"no-cache",
    "sec-fetch-mode":"cors",
    "sec-fetch-site":"same-origin",
    "x-requested-with":"XMLHttpRequest"},
    "referrer":"https://www.bullmarketbrokers.com/Cotizaciones/Acciones",
    "referrerPolicy":"no-referrer-when-downgrade",
    "body":null,
    "method":"GET",
    "mode":"cors"})
    .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        json.result.reduce((result, bond) => {
            if (bond.ticker.endsWith('D')) {
                const pesoBondName = bond.ticker.slice(0, -1);
               const pesoBond = json.result.find((pesoBond) => {
                   return pesoBondName === pesoBond.ticker;
               });
               if(pesoBond && hasAskAndBid(pesoBond, bond)) {
                   result.push({
                       peso: pesoBond,
                       dolar: bond,
                   });
               }
            }
            return result;
        }, [])
        .forEach((dualBond) => {
            const bondParagraph = document.createElement('p');
            const askPrice = dualBond.peso.stockOffer.askTop[0].price;
            const bidPrice = dualBond.dolar.stockOffer.bidTop[0].price;
            const dollarPrice = (askPrice / bidPrice).toFixed(4);
            bondParagraph.innerHTML = `${dualBond.peso.ticker}: $${dollarPrice} (buy: ${askPrice} sell: ${bidPrice})`;
            dialogEl.appendChild(bondParagraph);
            console.log(dualBond);
        });
      });
};

const hasAskAndBid = (pesoBond, bond) => {
    return pesoBond.stockOffer.askTop.length
        && bond.stockOffer.bidTop.length
        && pesoBond.stockOffer.askTop[0].price !== 0
        && bond.stockOffer.bidTop[0].price !== 0;
};


const createDialog = () => {
    const dialogString = `<div id="mydivheader">Bonos disponibles</div>`;
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = dialogString;
    htmlObject.id = "mydiv";
    document.body.prepend(htmlObject);
    dragElement(htmlObject);
    return htmlObject;
};

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

switch(document.location.host) {
    case "www.bullmarketbrokers.com": {        
        const dialogEl = createDialog();
        init_bmb(dialogEl);
    }
}