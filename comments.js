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
  const commentsRef = query(collection(db, "comments"), orderBy("timestamp"));
  onSnapshot(commentsRef, (snapshot) => {
    commentsList.innerHTML = ""; // Clear previous comments
    snapshot.forEach((doc) => {
      const commentData = doc.data();
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");

      // Get the timestamp and format it dynamically
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

// Function to format the timestamp dynamically
function formatTimestamp(timestamp) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Start of yesterday

  if (timestamp >= today) {
    // If the comment was posted today, show HH:MM
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (timestamp >= yesterday) {
    // If the comment was posted yesterday, show "Yesterday"
    return "Yesterday";
  } else {
    // Otherwise, show DD MMM YYYY
    return timestamp.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}

// Event listener for the form submission
feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const commentText = commentTextarea.value;
  if (commentText) {
    addComment(commentText);
    commentTextarea.value = ""; // Clear the textarea
  }
});

// Fetch comments initially
fetchComments();
