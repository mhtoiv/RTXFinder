const cheerio = require("cheerio");
const axios = require('axios');
const chalk = require("chalk");

const maxprice = Number(process.argv[2]);
const displayPrice = process.argv[3] === 'y';


const urls = require('./constants').urls;

const check = async(url) => {
    let title;
    let price;
    let stock;
        await axios
            .get(url)
            .then(res => {
                let $ = cheerio.load(res.data);
                if (url.includes("verkkokauppa.com")) {
                    title = $('.product-header-title').text();
                    price = $('.price-tag-content__price-tag-price--current').text().replace(/\s+/g, "").replace(",", ".");
                    stock = $('.status').attr('class') === 'status status--green';
                    console.log("Verkkokauppa.com: " + title);
                } else if (url.includes("jimms.fi")) {
                    title = $('.name:nth-child(1)').text();
                    price = $('.pricetext>span').text().replace(/\s+/g, "").replace(",", ".").replace("€", "");
                    stock = !$('.deliverytime').text().includes("Ei vahvistettu")
                    console.log("Jimm's: " + title);

                }
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
            })
            .catch(error => console.log(error));
}

const startSearch = async() => {
    for (let i = 0; i < urls.length; i++) {
        await check(urls[i])

    }
}

startSearch().then(() => console.log("Checkup completed!"));



