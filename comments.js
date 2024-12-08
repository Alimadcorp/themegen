import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBR1UeKEAJV4x3YOjzMFDsaSUwQiLgJNFQ",
    authDomain: "commentspagetests.firebaseapp.com",
    projectId: "commentspagetests",
    storageBucket: "commentspagetests.firebasestorage.app",
    messagingSenderId: "560501874254",
    appId: "1:560501874254:web:2cab2358cb517c3418ad1f",
    measurementId: "G-HYDSZ89BLH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // DOM Elements
  const feedbackForm = document.getElementById('feedbackForm');
  const commentTextarea = document.getElementById('comment');
  const commentsList = document.getElementById('comments-list');

  // Function to add a comment to Firestore
  async function addComment(commentText) {
    try {
      await addDoc(collection(db, 'comments'), {
        text: commentText,
        timestamp: serverTimestamp()
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
      snapshot.forEach(doc => {
        const commentData = doc.data();
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `<p>${commentData.text}</p>`;
        commentsList.appendChild(commentElement);
      });
    });
  }

  // Submit the comment when Enter is pressed
  commentTextarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent the default action (like a new line)
      const commentText = commentTextarea.value;
      if (commentText) {
        addComment(commentText);
        commentTextarea.value = '';  // Clear the textarea
      }
    }
  });

  // Fetch comments initially
  fetchComments();