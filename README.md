# GIFter
Search and add custom text to GIFs from the Giphy API!

The idea was to make a one stop, quick to use, SPA for making a custom GIF to GIFt to friends on social media.
GIFs are a popular digital present for birthdays, etc, and customising extends that love a little further ;D

# Mobile responsive
GIFfing on the bus or during other time-plenty situations is a must. The SPA is fully mobile responsive.

# Dependencies 
GIFter relies on GIFlib, GIFshot and jscolor javascript libraries.

GIFshot adds the text and makes the final GIF, however, it will not accept an animated GIF as it's starting point.
GIFlib is used to split the GIF into canvas frames in the DOM, and that node tree is passed to GIFshot.

# Known bug
Larger GIFs will cause a network error when download button is clicked in some browsers (chrome). 
Manual saving of the image works fine.
This will be fixed soon!