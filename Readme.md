#3D Render Farm
I made a very simple 2D render farm as a proof of concept, now this is a 3D render farm that's capable of a lot more thanks to ThreeJS.

##How does it work?
First, make a scene and its animations in the [ThreeJS Editor](http://threejs.org/editor), then "Publish" the sene, take "app.json" and drop it into this code.

**Important**: When writing scripts for objects in the editor, base all of your code off of `event.time`. See the blog post for more info.

Then, run the server, attach nodes, and watch it distribute the frames over all available nodes. I think it's pretty neat. All frames are sent back via post to the server.

Be sure to [read the blog post](http://undocumented-code.blogspot.com/2016/08/render-farm-3d-edition.html) for more information about this project.
