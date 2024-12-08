import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
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
  const commentsQuery = query(commentsRef, orderBy("timestamp")); // Order by timestamp
  onSnapshot(commentsQuery, (snapshot) => {
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

// Function to format the timestamp to HH:MM
function formatTimestamp(timestamp) {
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Handle submit button click
document.getElementById("sub").addEventListener("click", () => {
  const commentText = commentTextarea.value;
  if (commentText) {
    addComment(commentText);
    commentTextarea.value = "";
  }
});

// Fetch comments initially
fetchComments();
