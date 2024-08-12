# Fruityvice app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 

## Starting the project

Install dependecies

```
npm i
```

Run development server

```
npm start
```



## Data Fetching

I used [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) that comes as a part of [Redux Toolkit](https://redux-toolkit.js.org) to fetch data. Using Redux Toolkit also simplified managing states of user selected fruits.

To overcome [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) restrictions I used [CORS proxy](https://corsproxy.io).



## Layout

> [TailwindCSS](https://tailwindcss.com) was used to style this project. It is [**not recommended**](https://tailwindcss.com/docs/guides/create-react-app) to use it with Create React App, so for production purpose I would use other recommended approach.

As per the assignment, the app is divided into left (fruits list), and right (the jar) sections. It is responsive and columns stack on a small screens.



## Group By Functionality

Implemented with a Redux state.



## Fruit List

The initial assignments requires `Each fruit entry should be displayed in the format: {fruit name} ({amount of calories})`. Initially I have implemented it that way, but I found that brakets overwhelm the UI, so I used `{fruit name} – XX cal` formal instead.

To make sure the is no confusion between adding a single fruit and a group of fruits I did the following visual distinctions:

- Have a dedicated name for a button that adds a whole goup **Add Group** (instead of just **Add**)
- Assigned different colors for those buttons
- Moved **Add Group** button from the same column as a singualr **Add** button



## Jar Functionality

In addition to the required functionality the jar also shows if multiple instances of fruit was added to it (like 2 apples).

Furthermore, a user is able to remove a fruit from the jar by clicking **Remove** button.