## **1DV527**


# **The web as an application platform**

**Dawid Kaleta**


## Introduction

The second examining assignment in course **1DV527**, where I had to create a REST (Web) API for the imaginary fishing club "_Den svartmunnade smörbultens banne_". The idea is that fishermen should be able to report their catch and that this data could be made public. They want data like: weight, length, position, specie, image etc. The API should not contain a client which can be made later separately.



1. **Explain and defend your implementation of HATEOAS in your solution.**

I’ve been trying to fill all URL-endpoints of the API with responses of links to be able to guide the user (or system) through the server and resources. Already from the root-URL (e.g. localhost:3000/) the user receives information and what to append to the URL to go to the starting point of the API (/api). The links are sent in a JSON-format and often in objects or arrays depending on if there are more than one and if they come together with a fish or user resource. When a user or fish is created that resource contains their own self link and their fisherman’s URL. Finally, the links also come together with methods that are allowed and other details like which parameters they take.

2. **If your solution should implement multiple representations of the resources. How would you do it?**

In my case right now I decided to only rely on JSON as the resource format (together with status codes). I could eventually also add the possibility for the client to prefer formats like HTML or others. I think the best solution would be to add a function to listen in the header for the format tags and then possibly implement the Json2HTML library or make my own by working more with the objects.

3. **Motivate and defend your authentication solution.**

I decided to work with JWT-tokens and local users accounts stored in my MongoDB-database. The password was of course salted and hashed before storing it in the database and the token contained only the user ID and name of the user, no password there! The hashing and salting uses the secret string from the server (stored as an environment variable) so that only the API can know how to read them. Then, the server uses HTTPS (SSL) to encrypt the data being sent (locally it only uses a self-signed certificate though for development). I also set a quite short expiry date of the tokens so that the user has to log in more often for security reasons.

- **What other authentication solutions could you implement?**

I was considering using something like oAuth with a third party provider like Facebook or Google as many sites use this nowadays and it could be interesting to try.

- **What pros/cons do this solution have?**

The pro of using oAuth with a third party provider would be that I would not have to think about the security of storing user credentials as they will be the ones taking care of those things, providing the users of the API with access to the resource server. One con with using these third party providers to log in is, even if not so probable right now, that it would affect our application if they would go down as the API would be very dependent on them.

4. **Explain how your webhook works.**

I made a URL-endpoint to the main resource of the API (_/api/fishes/hook_) where the user can send their POST-request with a URL as a JSON-object. That URL will then be saved in the database from a mongoose model. When a fish is created, changed or deleted the server will send POST-requests to all hook-URLs saved in the database as hooks with the actual fish object in JSON and a message stating what has happened.

5. **Since this is your first own web API, there are probably things you would solve in another way, looking back at this assignment. Write your thoughts about this.**

In an actual implementation I would probably redirect on login using something like status code 303 to some main page or dashboard. I also noticed pretty quickly that it got a bit messy sending the HATEOAS-linking as JSON in the res-body all the time, especially when the body already contains fish objects. Therefore, now in a later stage I’ve learnt that it’s probably better to send them in a link-header together with the methods and parameters allowed.

Maybe I could also make the resources more hierarchical like using _fishes/species/{specie}/{fishId}_to make it more traversable with bigger amounts of fish. I could also add more upon the login / users by having different roles like admins and normal users but stated it superfluous for this assignment. Also, I could think of a more automatic function to create the HATEOAS-linking for new routes/resources. Finally, I also forgot to give information regarding the units used for the different model parameters like weight (kg) and length (cm).

6. **Did you do something extra besides the fundamental requirements? Explain them.**

I hate leaving a project because I’m never fully satisfied with it, always finding more to improve upon and extra functionalities. With the short time frame I had due to other courses I did some degree of improvements like:



*   In the beginning I was experimenting and added a PATCH method for the fishes for only one parameter.
*   I implemented a _shortId to try to keep the URLs short and not 30 letters long like before.
*   I implemented an auth / verification middleware or route which checks and controls the user data so that they are valid, exist and unique (when registering).
*   I also implemented a validation route / middleware for controlling that specified details are correctly formatted, like e.g. a real e-mail address.
*   I implemented rate limiting which I set to 100 times (not too low for the testing purposes) for a shorter period of time of 15 min.
*   Expiry dates were added to the tokens.
*   Resources can only be deleted or modified by their owner (if logged in), this includes themselves as users too.
*   I implemented Helmet, a CSP and a minor XSS-protection for security.
*   The fish resources are public and can be viewed (by using the GET-method) by anyone.
*   And probably some more things which I can’t remember at the moment...
