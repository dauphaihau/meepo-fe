# Meepo
![Screenshot](./public/preview.png)
Meepo is a free social networking site where people converse with each other in short messages

<a href="https://meepo-app.onrender.com">Try it now</a>

## Technologies
1. Vue.js (JavaScript framework)
2. Tailwind CSS (Styling)
3. Typescript (Statically Checked Types)
4. Ruby on Rails (Full-stack framework)
5. Postgresql (Database)

## Work In Progress
The app is being under maintenance, as more work needs to be done.

Current functionality includes:
- Log in, Sign up, Sign out, Update profile
- CURD, like, comment, pin, filters post
- Follow/unfollow user
- Search posts/users based on followers, likes, image, where user comment 
- Search trends based on hashtags 

## Known Bugs
Feel free to email me at dauphaihau@gmail.com if you run into any issues or have questions, ideas or concerns. Please enjoy
and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

## Future Updates
- Improve overall UX/UI and fix bugs
- Realtime count likes, posts, notifications, chat
- Limit the number of edits post

And More ! There's always room for improvement!

## Installation Guide
### Client-side
> **Note**
> Requirements: [Node.js](https://nodejs.org) >= 16.2.x
 
1. **Clone the GitHub repository**
```bash
https://github.com/dauphaihau/meepo.git
```
2. **Install dependencies**
```bash
yarn
```
3. **Copy .env.example to .env and update the variables**
 

4. **Launches a dev server**
```bash
yarn dev
```
### Server-side

Source backend: <a href="https://github.com/dauphaihau/meepo-be">link</a>
> **Note**
> Requirements: [Ruby](https://www.ruby-lang.org/en/) >= 3.0.0

1. **Clone the GitHub repository**
```bash
https://github.com/dauphaihau/meepo-be.git
```

2. **Configure Database**
 
    set your url database into config/database.yml 
 

3. **Install gems**
```bash
bundle install
```

4. **Runs migrations**
```bash
rails db:migrate
```
5. **Launches a web server**
```bash
rails s
```
