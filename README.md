# Social media
## Back-end
---
## auth middleware
---
* ### 2 role, admin and user
* ### register user, login user, hashed password, generate token
* ### any login user can post a new post, update the posts and review posts
* ### admin can review all the posts and delete any post
* ### all login users can type a comment, edit the comment and delete the comment
---
* ### post model functios, all crud operations create a new post, read all posts & read a post by id, update the post and soft delete a post 
---
# UML Diagram:
![alt text](https://github.com/Ghadier-Alenezi/W08D04/blob/main/UMLdiagram.png)
---
# ERD
![alt text](https://github.com/Ghadier-Alenezi/W08D04/blob/main/ERD.png)
---
packages we use: 
*  Express to build the server

> npm i express

* mongoose manages relationships between data, provides schema validation
>npm i mongoose

* Dotenv to hide our secretkeys

> npm i dotenv

* bcrypt to bcrypt our passwords

> npm i bcrypt

* jsonwebtoken genreate tokens

> npm i jsonwebtoken
