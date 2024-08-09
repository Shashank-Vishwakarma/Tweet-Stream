# Tweet-Stream
This is a web app similar to twitter.

# Features
1. Add Post with text and image
2. Add comment on a post
3. Like a post
4. Login and SignUp authentication using JWT
5. Follow any user
6. get notifications about who followed you or liked your post
7. Update coverImage, profileImage and other info including reseting the password
8. Get suggested users

# Screenshots


# Technology
1. ReactJS
2. TailwindCSS
3. DaisyUI
4. NodeJs and Express
5. Tanstack React Query
6. Context API

# Setup
1. Create a .env file in root directory and add following config:
```
PORT=....
NODE_ENV=....
JWT_SECRET=....
MONGODB_URL=....
CLOUDINARY_CLOUD_NAME=....
CLOUDINARY_API_KEY=....
CLOUDINARY_API_SECRET=....
```

2. In the root directory, run the server as:
```npm run server```

3. Go to frontend directory and run the client as:
```npm run dev```
