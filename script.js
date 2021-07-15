require("chromedriver");
const fs = require("fs");
const wd = require("selenium-webdriver");
let browser = new wd.Builder().forBrowser('chrome').build();

let finalData = [];

async function main() {
    await browser.get("https://github.com/topics");
    await browser.wait(wd.until.elementLocated(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center")));
    let topicBoxes = await browser.findElements(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center"));
    for(let i = 0; i < topicBoxes.length; i++) {
        let url = await topicBoxes[i].getAttribute("href");
        finalData.push({topicUrl : url});
    }
    console.log(finalData);
    for(let i = 0; i < finalData.length; i++) {
        await browser.get(finalData[i].topicUrl);
        let projectBoxes = await browser.findElements(wd.By.css("a.text-bold"));
        finalData[i]["projects"] = [];
        for(let j = 0; j < projectBoxes.length; j++) {
            if( j == 2) {  // -> to get only 2 projects
                break;
            }
            finalData[i].projects.push({projectUrl: await projectBoxes[j].getAttribute("href")});
        }
        // console.log(finalData);
        for(let j = 0; j < finalData[i].projects.length; j++) {
            await browser.get(finalData[i].projects[j].projectUrl + "/issues");
            let issueBoxes = await browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open"));
            finalData[i].projects[j]["issues"] = [];
            let currUrl = await browser.getCurrentUrl();    //=> if issue present (chec sjango url)
            if(currUrl == (finalData[i].projects[j].projectUrl + "/issues")) {      //=> if issue present (chec sjango url)
                for(let k = 0; k < issueBoxes.length; k++) {
                    if(k == 2) {   // -> to get only 2 issues   
                        break;
                    }
                    let heading = await issueBoxes[k].getAttribute("innerText");
                    let url = await issueBoxes[k].getAttribute("href");
                    finalData[i].projects[j].issues.push({heading: heading, url: url});
                }
            }
            
        }
    }
    fs.writeFileSync("finalData.json", JSON.stringify(finalData)); //-> terminal pe 2nd level tk hi dekhta h uske baad se object form dekhata h toh islie json file
    browser.close();
}

main();

