const cheerio = require("cheerio");
const axios = require('axios');
const chalk = require("chalk");

const maxprice = Number(process.argv[2]);
const displayPrice = process.argv[3] === 'y';


const urls = require('./urls').urls;

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



