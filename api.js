import authProperties from './auth.js';

const {
    cookie,
    xClientData
} = authProperties;

if(!cookie) {
    throw new Error('fdsafdsa')
}

function parseOutInfo(text) {
    const regex = /\[\[.*\"generic\"\]\]/g;
    const found = text.match(regex);
    let outer = JSON.parse(found[0])
    let inner = JSON.parse(outer[0][2])
    let photoIds = inner[0].map(el => el?.[0])
    let pageToken = inner.at(-5)
    return {photoIds, pageToken}
  }

export async function getPhotoList({searchQuery}) {
    let numPhotos = 1000; // number per batch...doesn't always seem to come back with 1000 though
    let res = await fetch("https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=EzkLib&source-path=%2Fsearch%2Fjpg%2520OR%2520jpeg%2520OR%2520png%2520OR%2520heic&f.sid=307050036153956327&bl=boq_photosuiserver_20221116.05_p1&hl=en&soc-app=165&soc-platform=1&soc-device=1&_reqid=79959&rt=c", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
        "sec-ch-ua-arch": "\"arm\"",
        "sec-ch-ua-bitness": "\"64\"",
        "sec-ch-ua-full-version": "\"107.0.5304.87\"",
        "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"107.0.5304.87\", \"Chromium\";v=\"107.0.5304.87\", \"Not=A?Brand\";v=\"24.0.0.0\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": "",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-ch-ua-platform-version": "\"12.5.1\"",
        "sec-ch-ua-wow64": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-client-data": xClientData,
        "x-goog-ext-353267353-jspb": "[null,null,null,128892]",
        "x-same-domain": "1",
        "cookie": cookie,
        "Referer": "https://photos.google.com/",
        "Referrer-Policy": "origin"
      },
      "body": `f.req=%5B%5B%5B%22EzkLib%22%2C%22%5B%5C%22${searchQuery}%5C%22%2C%5B%5D%2Cnull%2Cnull%2C${numPhotos}%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AGnVvw5ygyuyFbvyqUD1okY4bjzp%3A1668748357080&`,
      "method": "POST"
    });
  
    let allPhotoIds = []
    let text = await res.text();
    let {photoIds, pageToken} = parseOutInfo(text)
    allPhotoIds.push(...photoIds);
  
    try {
      for (let i = 0; i < 100; i++) {
        console.log("fetching page " + (i + 2));
        text = await nextPage({pageToken, searchQuery}).then(r => r.text());
        let obj = parseOutInfo(text);
        allPhotoIds.push(...obj.photoIds);
        pageToken = obj.pageToken;
      }
    } catch (e) {
      console.log('error, so must be done!')
    }
  
    // console.log("photoIds: ", JSON.stringify(allPhotoIds));
    console.log("first photo id: ", allPhotoIds[0]);
    console.log("last photo id: ", allPhotoIds.at(-1));
    console.log("unique photoIds: ", new Set(allPhotoIds).size);
  
    return allPhotoIds;
  }

export function moveToAlbum({photoIds, albumId}) {
    let delimiter = '%5C%22%2C%5C%22'
    let joinedPhotoIds = photoIds.join(delimiter);
  
    return fetch("https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=E1Cajb&source-path=%2Fphoto%2FAF1QipN9gSlNlByTys6fOrb-0jz5PEXep0f2lxEaFBY1&f.sid=-2858565525455532615&bl=boq_photosuiserver_20221113.06_p0&hl=en&soc-app=165&soc-platform=1&soc-device=1&_reqid=20078249&rt=c", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
      "sec-ch-ua-arch": "\"arm\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-full-version": "\"107.0.5304.87\"",
      "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"107.0.5304.87\", \"Chromium\";v=\"107.0.5304.87\", \"Not=A?Brand\";v=\"24.0.0.0\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-ch-ua-platform-version": "\"12.5.1\"",
      "sec-ch-ua-wow64": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-client-data": xClientData,
      "x-goog-ext-353267353-jspb": "[null,null,null,128871]",
      "x-same-domain": "1",
      "cookie": cookie,
      "Referer": "https://photos.google.com/",
      "Referrer-Policy": "origin"
    },
    "body": `f.req=%5B%5B%5B%22E1Cajb%22%2C%22%5B%5B%5C%22${joinedPhotoIds}%5C%22%5D%2C%5C%22${albumId}%5C%22%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AGnVvw7JAfMK3nPYypXzj_HDeLV8%3A1668487444855&`,
    "method": "POST"
  })
  }



  
  function nextPage({pageToken, searchQuery}) {
  return fetch("https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=EzkLib&source-path=%2Fsearch%2Fjpg%2520OR%2520jpeg%2520OR%2520png%2520OR%2520heic&f.sid=307050036153956327&bl=boq_photosuiserver_20221116.05_p1&hl=en&soc-app=165&soc-platform=1&soc-device=1&_reqid=119579959&rt=c", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
      "sec-ch-ua-arch": "\"arm\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-full-version": "\"107.0.5304.87\"",
      "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"107.0.5304.87\", \"Chromium\";v=\"107.0.5304.87\", \"Not=A?Brand\";v=\"24.0.0.0\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-ch-ua-platform-version": "\"12.5.1\"",
      "sec-ch-ua-wow64": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-client-data": xClientData,
      "x-goog-ext-353267353-jspb": "[null,null,null,128907]",
      "x-same-domain": "1",
      "cookie": cookie,
      "Referer": "https://photos.google.com/",
      "Referrer-Policy": "origin"
    },
    "body": `f.req=%5B%5B%5B%22EzkLib%22%2C%22%5B%5C%22${searchQuery}%5C%22%2C%5B%5D%2C%5C%22${pageToken}%5C%22%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AGnVvw5ygyuyFbvyqUD1okY4bjzp%3A1668748357080&`,
    "method": "POST"
  });
  }