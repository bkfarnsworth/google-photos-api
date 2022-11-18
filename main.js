import {getPhotoList, moveToAlbum} from './api.js'
import {getRandomIntInclusive} from './util.js'

let photoList = await getPhotoList({
    searchQuery: encodeURI('jpg OR jpeg OR png OR heic AND 2019 OR 2020 OR 2021 OR 2022 OR 2023 OR 2024')
})
  
// create shuffled array
let numToInclude = 1000;
let shuffled = [];
for (let i = 0; i < numToInclude; i++) {
    const randomIndex = getRandomIntInclusive(0, photoList.length - 1)
    shuffled.push(photoList[randomIndex]);
}

await moveToAlbum({photoIds: shuffled, albumId: 'AF1QipMtMcXvWU4rob4HJqNY4lXL8mGRdoB-F4Ihw390' })

  
  

  
  
