# Gerenciador de Minicursos

[Powered by Meteor](https://www.meteor.com/)

## Usage instructions:
0. [Install Meteor](https://www.meteor.com/install)
0. Clone the repository, and start Meteor where you've cloned

        git clone https://github.com/evsasse/minicursos.git
        cd minicursos
        meteor
0. Using a browser go to localhost:3000, then configure Google login following the instructions that will appear
0. Login with your account
0. As the first user you should automagically become admin, if that doesn't happen, or you uncheck yourself from admin you can follow the next intructions.
0. As admin the form for creating courses should be showing up, create a course :)

## Making yourself an Admin, from the server-side
**If you have access to an admin account it's much easier to do this using the web interface**

0. On another terminal open the interface Meteor provides for MongoDB, where you've cloned

        cd minicursos
        meteor mongo
0. Confirm that your login showed up on the "users" collection

        db.users.find();
0. It should return the users that logged in, find the document correspondent to your Google account and copy
the value for "_id", it should look something like this:

        { "_id" : "SmdiDgeZpMKJJ93RX", "createdAt" : ISODa ...
0. You've then copied "SmdiDgeZpMKJJ93RX"
0. We will edit this document to make you an admin. So update the document setting the field "admin" to true:

        db.users.update({"_id": "SmdiDgeZpMKJJ93RX"},{$set:{"admin":true}});
0. It should be working now, using the browser go localhost:3000 again. Login with your account again if necessary.
