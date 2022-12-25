# Filebase

# About

A small feature of my previous project allowed users to upload pictures. Those images, however, were stored locally within an 'uploads' directory within the project itself and not in the cloud. I was not satisified with that aspect of my project so I decided to create this app to learn about storing images remotely and retrieving those images when needed. Filebase is a simple file hosting app. Users are able to upload files and then download them at a later time.

I also wanted to experiment with NextJS (instead of CRA) and Prisma (instead of writing my own models and SQL queries)

# Features

- NextAuth/OAuth for signups, signins persistent signins and sessions
- Can perform CRUD operations on folders
- Can perform CRD operations on files
- Files are stored in Google's Firebase Storage
- DB and UI are in sync at all times thanks to hooks wrapped around React Query for UX
- Modals!
- Conditionally renders CSS (ex buttons are 'greyed out' when submitting) for better UX
- and much more!

# Technologies

- NextJS
- NextAuth
- Prisma
- PostgreSQL
- Firebase
- Typescript
- React Query
- TailwindCSS

# Goals

- Learn how to store and retrieve files from Firebase
- Learn how to use Firebase's client SDK and Firebase's admin SDK/Google Cloud Storage API
- Familarize myself with NextJS (file-based routing, SSR, etc.)
- Work with TypeScript
- Connect Prisma with a PostgreSQL DB and create schemas to build tables in the DB
- Use Prisma's ORM
- Learn about NextAuth for signins and persist signups in the DB

# Improvements

- Create folder breadcrumbs for better UX
- Possibly better security to absolutely ensure files can only be viewed by their owners
- More error handling (can never go wrong with more error handling of edge cases)
- I should have incorporated TypeScript while developing instead of saving it until the end (would have caught issues while developing and not just at the end of the project + the intellisense would have been much more helpful during the coding and not just at the tailend of the project)
