// The whole point of async java script is to execute some parts of program
// while some thing else is working in the background
// To prevent the program from failing or malfunctioning.
// Since javascript is synchronous and does not wait
// for any part to execute before calling the next block,
// these may cause some serious problems hence the need for Async.
// Async function be like, bro, you go ahead and run, imma take a bit of time

// 1 Callbacks
// Call backs are functions that are passed to other functions as parameters
// and these functions are called after the have finished running
// It essentially is a chain of function events.

function firstFunction(parameters, callbacks) {
  // do stuff
  callbacks();
}

// It may lead to an issue of complex function chains called callback Hell like below.

firstFunction(param, function () {
  // do stuff
  secondFunction(param, function () {
    //do Stuff
    thirdFunction(param, function () {
      //Do stuff
    });
  });
});

// 2 Promises
// Promises are designed to tackle the issue of callbacks
// Promises are async functions
// promises have three states: Pending, fulfilled, rejected

const aPromise = new Promise((resolve, reject) => {
  const error = false;
  if (!error) {
    resolve("Yes! promise resolved!");
  } else {
    reject("Promise rejected!");
  }
});
console.log(aPromise); // This returns the state of the promise
// A promise may not return a value where you expect it to,
// you need to wait for it to resolve, hence the use of then.
aPromise
  .then((value) => {
    // console.log(value);
    return value + 1;
  })
  .then((newValue) => {
    console.log(newValue);
  })
  .catch((err) => {
    console.log(err);
  });

const nextPromise = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve("My next promise");
  }, 3000);
  // setTimeout(() => {}, 3000) // same as above
});

nextPromise.then((value) => {
  console.log(value);
});

aPromise.then(value);

// Demonstrating the third state of promise, pending
// this is just saying grab the data from the url, turn it json
// then store it in the variable data
const users = fetch("https://jsonplaceholder.typicode.com/users")
  // the first then gets the response and converts it to json value
  .then((response) => {
    return response.json();
  })
  // the second then gets the json
  .then((data) => {
    data.forEach((user) => {
      console.log(user);
    });
  });

// This line execute before the line above. Hence it causes a problem.
console.log(users);

// Although promises are not callback hell,
// it can lead to having a lot of "then" chained up together leading to thenables
// which can get out of hand, hence the need for async/await.

// 3 Async/Await

const myUsers = {
  userList: [],
};

// async function myAsyncFunction(){}
// const myAsyncFunction = async () => {};

const asyncFunction = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return data;
};
asyncFunction();

// to chain async await like in promises
const anotherAsyncFunction = async () => {
  // await asyncFunction(); // or equate it to a variable
  dataBox = await asyncFunction();
  myUsers.userList = dataBox;
  console.log(myUsers.userList);
};
anotherAsyncFunction();
// The console log below will return an empty array
// because it is not awaiting any value.
console.log(myUsers.userList);

// Workflow function
const getAllUsersEmail = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  const userEmailArray = data.map((user) => {
    return user.email;
  });

  console.log(userEmailArray);

  // Calling a non async function after awaiting
  postToWebPage(userEmailArray);
};

// This function unlike the one above does not need to be async
// or await anything to get access to the data from the async function
// This is because it has already been called within the async function
// after awaiting the data to arrive
const postToWebPage = (data) => {
  console.log(data);
};

getAllUsersEmail("https://jsonplaceholder.typicode.com/users");

// Second Parameter of Fetch with json using "GET"
const secondAsyncFunction = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  console.log(data); // Returns the joke and status code
  console.log(data.joke); // Returns just the joke
};
secondAsyncFunction("https://icanhazdadjoke.com/");

// Second Parameter of Fetch with text
const secondAsyncFunction = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/plain",
    },
  });
  const data = await response.text();
  console.log(data);
};
secondAsyncFunction("https://icanhazdadjoke.com/");

// When we post, there is a body parameter required in fetch
// that JSON.stringify what is being posted,
// then the method will be "POST"
// and we change Accept to Content-Type

const jokeObject = {
  id: "THYUOPLKeds",
  joke: "What did the goat say? Meh seeeee?",
};

const postDadJokes = async (jokeObj, url) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jokeObj),
  });
  const data = await response.json();
  console.log(data);
};

postDadJokes(jokeObject, "https://httpbin.org/post");

// Fetching using dynamic params
// You can always return the data first to see the object returned

const fetchRequest = async (firstName, lastName, category, url) => {
  const response = await fetch(
    `${url}?firstName=${firstName}&lastName=${lastName}&limitTo=[${category}]`
  );
  const data = await response.json();
  console.log(data.value.joke);
};
fetchRequest(
  "Archangel",
  "Macsika",
  "nerdy",
  "https://api.icndb.com/jokes/random"
);
fetchRequest("Archangel", "Macsika", "http://api.icndb.com/jokes/126");

// abstract into different functions using a procedural "workflow" function
// Collect form data, post to a uri and get a joke

const getFormData = () => {
  dataObj = {
    firstName: "Archangel",
    lastName: "Macsika",
    category: ["nerdy"],
  };
  return dataObj;
};

const formPostUrl = (formData) => {
  const url = `https://api.icndb.com/jokes/random?firstName=${formData.firstName}&lastname=${formData.lastName}&limitTo=${formData.category}`;
  return url;
};

const jokeFetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  postToPage(data);
};

const postToPage = (data) => {
  console.log(data.value.joke);
};

const codeRunner = async () => {
  const postObj = getFormData();
  const postUrl = formPostUrl(postObj);
  const jokeGetter = await jokeFetcher(postUrl);
};

codeRunner();

// Using Axios in React or nextJS
// npm install axios
// create an axios base url file with the content below
// api/post.js
import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:8000",
});

// App.js or page.js
// Axios automatically returns a json response s need to do the second step conversion
// like in fetch. Also, axios gives the methods as functions that can be called
// Also, axios automatically returns a 200 if success and catches error
import api from "api/post";
import { useEffect } from "react";
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      // The if statement is just an added security check
      // can be completed ignored if, you are sure of
      // getting a response from the backend
      if (response && response.data) {
        // setPosts(response.data)
        console.log(response.data);
      }
    } catch (err) {
      // Not in the 200 response range but we got a response in backend api
      // You can use any of the error values below
      // this checks what is sent by the backend
      // as the reason for the error
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        // No response at all, or a 404 or all other errors
        // documentation for axios. This catches all errors not shown above
        console.log(`Error: ${err.message}`);
      }
    }
  };
  fetchPosts();
}, []);

// Axios POST
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post("/posts", dataToPost);
    console.log(response.data);
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      console.log(`Error: ${err.message}`);
    }
  }
};

// Axios DELETE
const handleDelete = async (id) => {
  try {
    await api.delete("/posts/${id}");
    console.log(response.data);
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      console.log(`Error: ${err.message}`);
    }
  }
};

// Axios Update
// We will use put since we are replacing the entire post data
// We could use patch if we were updating specific fields

const handleEdit = async () => {
  try {
    const response = await api.postUrl(`/posts/${id}`, updatePost);
    console.log(response.data);
    setPosts(
      posts.map((post) => (post.id === id ? { ...response.data } : post))
    );
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      console.log(`Error: ${err.message}`);
    }
  }
};
