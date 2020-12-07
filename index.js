const cheerio = require("cheerio");
const axios = require('axios');
const chalk = require("chalk");

const maxprice = Number(process.argv[2]);
const displayPrice = process.argv[3] === 'y';

const urls = [
    'https://www.jimms.fi/fi/Product/Show/164678/tuf-rtx3080-10g-gaming/asus-geforce-rtx-3080-tuf-gaming-naytonohjain-10gb-gddr6x','https://www.verkkokauppa.com/fi/product/58075/qdkfx/MSI-GeForce-RTX-3080-SUPRIM-X-10G-naytonohjain-PCI-e-vaylaan?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
    'https://www.jimms.fi/fi/Product/Show/164677/tuf-rtx3080-o10g-gaming/asus-geforce-rtx-3080-tuf-gaming-oc-edition-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/165436/zt-a30800j-10p/zotac-geforce-rtx-3080-trinity-oc-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/164725/rog-strix-rtx3080-o10g-gaming/asus-geforce-rtx-3080-rog-strix-oc-edition-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/164683/rtx-3080-gaming-x-trio-10g/msi-geforce-rtx-3080-gaming-x-trio-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/164788/gv-n3080eagle-oc-10gd/gigabyte-geforce-rtx-3080-eagle-oc-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/166467/ned3080u19ia-1020g/palit-geforce-rtx-3080-gamerock-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/165590/gv-n3080aorus-m-10gd/gigabyte-geforce-rtx-3080-aorus-master-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/165447/zt-a30800f-10p/zotac-geforce-rtx-3080-amp-holo-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/166700/geforce-rtx-3080-suprim-x-10g/msi-geforce-rtx-3080-suprim-x-naytonohjain-10gb-gddr6x',
    'https://www.jimms.fi/fi/Product/Show/165456/gv-n3080vision-oc-10gd/gigabyte-geforce-rtx-3080-vision-oc-naytonohjain-10gb-gddr6x',
'https://www.verkkokauppa.com/fi/product/47599/qbgdj/EVGA-GeForce-RTX-3080-XC3-BLACK-GAMING-naytonohjain-PCI-e-va?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/8725/qbggg/EVGA-GeForce-RTX-3080-XC3-ULTRA-GAMING-naytonohjain-PCI-e-va?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/31239/qbggk/EVGA-GeForce-RTX-3080-FTW3-ULTRA-GAMING-naytonohjain-PCI-e-v?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/5227/qbggq/EVGA-GeForce-RTX-3080-FTW3-GAMING-naytonohjain-PCI-e-vaylaan?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/58254/qbggt/ZOTAC-GAMING-GeForce-RTX-3080-AMP-Holo-naytonohjain-PCI-e-va?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/41841/qbgfm/EVGA-GeForce-RTX-3080-XC3-GAMING-naytonohjain-PCI-e-vaylaan?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/46594/qbghb/Gigabyte-GeForce-RTX-3080-GAMING-OC-10G-naytonohjain-PCI-e-v?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/16951/nxgmg/Asus-ROG-STRIX-RTX3080-O10G-GAMING-naytonohjain-PCI-e-vaylaa?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/73519/qddct/Asus-ROG-STRIX-RTX3080-10G-GAMING-naytonohjain-PCI-e-vaylaan?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/24756/nxkmq/MSI-GeForce-RTX-3080-GAMING-X-TRIO-10G-naytonohjain-PCI-e-va?list=OZCYkRqBfusq290jq2N0wq2hNJq2hXnq2hBaq2NN3q2hkOqubW8qwXbgqcp3NqaaByB',
'https://www.verkkokauppa.com/fi/product/41878/nxkht/MSI-GeForce-RTX-3080-VENTUS-3X-10G-OC-naytonohjain-PCI-e-vay?list=OZCYkRqaaXDqcH3cqurYbq4nVDq2h0gb',
'https://www.verkkokauppa.com/fi/product/2928/nxgnb/Asus-TUF-RTX3080-O10G-GAMING-naytonohjain-PCI-e-vaylaan?list=OZCYkRqaaXDqcH3cqurYbq4nVDq2h0gb',
'https://www.verkkokauppa.com/fi/product/60767/qdsst/Asus-TUF-RTX3080-10G-GAMING-naytonohjain-PCI-e-vaylaan?list=OZCYkRqaaXDqcH3cqurYbq4nVDq2h0gb'];

const check = async(url) => {
        await axios
            .get(url)
            .then(res => {
                let $ = cheerio.load(res.data);
                if (url.includes("verkkokauppa.com")) {
                    const title = $('.product-header-title').text();
                    const price = $('.price-tag-content__price-tag-price--current').text().replace(/\s+/g, "").replace(",", ".");
                    const stock = $('.status') === 'status-green';
                    console.log("Verkkokauppa.com: " + title);
                    if (displayPrice && maxprice >= Number(price)) {
                        console.log(chalk.green(price + "€"));
                    } else if (displayPrice) {
                        console.log(chalk.red(price + "€"));
                    }
                    if (stock) {
                        console.log(chalk.green("ON STOCK!!!"))
                        if (maxprice >= price) {
                            console.log(chalk.green(price + "€!!!"));
                        } else {
                            console.log(chalk.red(price + "€ EXCEEDS MAX PRICE"));
                        }
                    } else {
                        console.log(chalk.red("OUT OF STOCK"));
                    }
                } else if (url.includes("jimms.fi")) {
                    const title = $('.name:nth-child(1)').text();
                    const price = $('.pricetext>span').text().replace(/\s+/g, "").replace(",", ".").replace("€", "");
                    const stock = $('.whrow:nth-child(2)>.whqty').text() !== '0 kpl';
                    console.log("Jimm's: " + title);
                    if (displayPrice && maxprice >= Number(price)) {
                        console.log(chalk.green(price + "€"));
                    } else if (displayPrice) {
                        console.log(chalk.red(price + "€"));
                    }
                    if (stock) {
                        console.log(chalk.green("ON STOCK!!!"))
                        console.log("price: " + price + " maxprice: " + maxprice)
                        if (maxprice >= price) {
                            console.log(chalk.green(price + "€!!!"));
                        } else {
                            console.log(chalk.red(price + "€ EXCEEDS MAX PRICE"));
                        }
                    } else {
                        console.log(chalk.red("OUT OF STOCK"));
                    }


                }
            })
            .catch(error => console.log(error));
}

const startSearch = async() => {
    for (let i = 0; i < urls.length; i++) {
        await check(urls[i])
        await new Promise(resolve => setTimeout(resolve, 0));

    }
}

startSearch().then(() => console.log("Checkup completed!"));

