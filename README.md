# yt-comments
A Chrome extension that utilizes the Youtube API to search through all comments on a video.

### Loading the extension

1. Click on the Omnibox (the icon to the far right). Select **Settings** then **Extensions**.
2. Ensure that the **Developer mode** checkbox in the top right-hand corner is checked.
3. Click **Load unpacked extension**... to pop up a file-selection dialog.
4. Navigate to the yt-comments directory and select it.

### To do

* The `fetchComments` function currently only retrieves a maximum of 25 comments. Update so that all comments are fetched.
* Since the change to Google+ powered comments, replies to comments are no longer included in the response from the Youtube API. Use Google's API. See [here](https://developers.google.com/youtube/articles/changes_to_comments).
* Add to Chrome Web Store.
