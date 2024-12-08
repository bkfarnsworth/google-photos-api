# google-photos-api

Simple package to automate workflows in google photos.

<b>NOT CURRENTLY WORKING. INTERNAL GOOGLE APIS CHANGED SINCE I LAST USED IT</b>

To use:
1. Clone the git repo. Make sure you have node and npm installed.  See package.json engines field for required versions.
2. Create a file in the root directory called `auth.js`. Should look like:
```
const authProperties = {
    "cookie": "",
    xClientData: "",
}

export default authProperties;
```
3. Add your cookie and clientData string to that file.  To get those values:
- Open up google photos in your browser
- Open the developer tools, and then open the network tab
- Do some action in the google photos UI, like moving a photo to an album.  You should see a network request come through going to this endpoint: "https://photos.google.com/_/PhotosUi/data/batchexecute"
- right click on that request, and "copy as node-fetch".  
- paste the request from your clipboard to a text editor, and you will see your cookie and cliendData
- copy and paste the cooke and clientData into the fields in auth.js
4. Look at the example code in main.js.  This code pulls down photos that meet a certain search criteria, and then picks 1000 random photos to move to an album called "screensaver".  I used these API calls to set up my photo screensaver so I can shuffle the pictures every so often.  
5. Now start writing your own workflow.  Use main.js to write your code, removing or rearranging the example api calls there to create your workflow.
6. Run your workflow: `node main.js`

And that's it! Not a ton of APIs are supported right now, but I'll add more as time goes on. Feel free to submit a pull request with other APIs and workflows as well!
