const cheerio = require('cheerio');
const axios = require('axios');
const chalk = require('chalk');

const maxPrice = Number(process.argv[2]);
const displayPrice = process.argv[3] === 'y';

const urls = require('./constants').urls;

const check = async(url) => {
    let productTitle;
    let productPrice;
    let stockStatus;

        await axios
            .get(url)
            .then(res => {
                let $ = cheerio.load(res.data);
                if (url.includes("verkkokauppa.com")) {
                    productTitle = $('.product-header-title').text();
                    productPrice = $('.price-tag-content__price-tag-price--current').text()
                        .replace(/\s+/g, "")
                        .replace(",", ".");
                    stockStatus = $('.status').attr('class') === 'status status--green';
                    console.log("Verkkokauppa.com: " + productTitle);
                } else if (url.includes("jimms.fi")) {
                    productTitle = $('.name:nth-child(1)').text();
                    productPrice = $('.pricetext>span').text()
                        .replace(/\s+/g, "")
                        .replace(",", ".")
                        .replace("€", "");
                    stockStatus = !$('.deliverytime').text().includes("Ei vahvistettu")
                    console.log("Jimm's: " + productTitle);
                }
                if (displayPrice && maxPrice >= Number(productPrice)) {
                    console.log(chalk.green(productPrice + "€"));
                } else if (displayPrice) {
                    console.log(chalk.red(productPrice + "€"));
                }
                if (stockStatus) {
                    console.log(chalk.green("ON STOCK!!!"));
                    if (maxPrice >= productPrice) {
                        console.log(chalk.green(productPrice + "€!!!"));
                    } else {
                        console.log(chalk.red(productPrice + "€ EXCEEDS MAX PRICE"));
                    }
                } else {
                    console.log(chalk.red("OUT OF STOCK"));
                }
            })
            .catch(error => console.log(error));
};

const startSearch = async() => {
    for (let i = 0; i < urls.length; i++) {
        await check(urls[i]);
    }
};

startSearch().then(() => console.log("Checkup completed!"));



