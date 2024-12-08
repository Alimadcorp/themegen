import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR1UeKEAJV4x3YOjzMFDsaSUwQiLgJNFQ",
  authDomain: "commentspagetests.firebaseapp.com",
  projectId: "commentspagetests",
  storageBucket: "commentspagetests.firebasestorage.app",
  messagingSenderId: "560501874254",
  appId: "1:560501874254:web:2cab2358cb517c3418ad1f",
  measurementId: "G-HYDSZ89BLH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const feedbackForm = document.getElementById("feedbackForm");
const commentTextarea = document.getElementById("comment");
const commentsList = document.getElementById("comments-list");

// Function to add a comment to Firestore
async function addComment(commentText) {
  try {
    await addDoc(collection(db, "comments"), {
      text: commentText,
      timestamp: serverTimestamp(),
    });
    console.log("Comment added!");
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
}

// Fetch and display comments
function fetchComments() {
  const commentsRef = collection(db, "comments");
  onSnapshot(commentsRef, (snapshot) => {
    commentsList.innerHTML = ""; // Clear previous comments
    snapshot.forEach((doc) => {
      const commentData = doc.data();
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");

      // Get the timestamp and format it
      const timestamp = commentData.timestamp
        ? commentData.timestamp.toDate()
        : new Date();
      const formattedTime = formatTimestamp(timestamp);

      // Add the comment text and timestamp
      commentElement.innerHTML = `
<p>${commentData.text}</p>
        <div class="comment-time">${formattedTime}</div>
      `;

      commentsList.appendChild(commentElement);
    });
  });
}

// Function to format the timestamp to a readable format
// Function to format the timestamp to a readable date (e.g., "Monday, Dec 8, 2024")
function formatTimestamp(timestamp) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return timestamp.toLocaleDateString("en-US", options);
}

document.getElementById("sub").addEventListener("click", () => {
  const commentText = commentTextarea.value;
  if (commentText) {
    addComment(commentText);
    commentTextarea.value = "";
  }
});

// Fetch comments initially
fetchComments();
