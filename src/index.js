const postsList = document.querySelector(".posts-list");
const addPostBtn = document.querySelector(".add-post__btn");
const closeBtn = document.querySelector(".close");
const addCommentBtn = document.getElementById("add-comment-btn");
const usernameInput = document.getElementById("username");
const commentTextInput = document.getElementById("comment-text");
const searchInput = document.querySelector(".search-input");
  
  async function createStories() {
    const server = `http://localhost:3000/posts`;
    try {
      const response = await fetch(server);
      const data = await response.json();
      data.forEach((serv) => {
        const li = document.createElement("li");
        li.classList = "post-item";
        li.dataset.postId = serv.id;
        li.innerHTML = `
              <h1 class="user">${serv.userName}</h1>
              <p class="post-info">${serv.info}</p>
              <button class="edit-post-btn">Edit Post</button>
              <button class="delete-post-btn">Delete Post</button>
              <button class="comment-btn">add comment</button>
              <div class="comments-container"></div>
          `;
        postsList.appendChild(li);
      });
    } catch (error) {
      console.error("error create:", error);
    }
  }
  createStories();
  let currentPostItem;

function openModal(event) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  currentPostItem = event.target.closest(".post-item");
}

function closeModal() {
  modal.style.display = "none";
  usernameInput.value = "";
  commentTextInput.value = "";
}

function addComment() {
  const userName = usernameInput.value.trim();
  const commentText = commentTextInput.value.trim();
  if (userName && commentText) {
    const commentHTML = `
            <div class="comment">
                <h2 class="comment-username">${userName}</h2>
                <p class="comment-text">${commentText}</p>
            </div>
        `;
    const commentsContainer = currentPostItem.querySelector(
      ".comments-container"
    );
    if (commentsContainer) {
      commentsContainer.innerHTML += commentHTML;
    } else {
      console.error("error");
    }
  }
}

postsList.addEventListener("click", function (event) {
  const commentBtn = event.target.closest(".comment-btn");
  const editBtn = event.target.closest(".edit-post-btn");
  const deleteBtn = event.target.closest(".delete-post-btn");
  if (commentBtn) {
    openModal(event);
  } else if (editBtn) {
    editPost(event);
  } else if (deleteBtn) {
    const postId = event.target.closest(".post-item").dataset.postId;
    deletePost(postId);
  }
});

addCommentBtn.addEventListener("click", addComment);
closeBtn.addEventListener("click", closeModal);

function editPost(event) {
  const post = event.target.closest(".post-item");
  const postInfo = post.querySelector(".post-info");
  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "block";
  const editPostInput = editModal.querySelector("#edit-post-text");
  editPostInput.value = postInfo.textContent;

  const saveEditBtn = editModal.querySelector("#save-edit-btn");
  saveEditBtn.addEventListener("click", () => {
    postInfo.textContent = editPostInput.value;
    editModal.style.display = "none";
  });

  const cancelEditBtn = editModal.querySelector("#cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });
}

function addNewPost() {
    const addPostModal = document.getElementById("addPostModal");
    const addPostName = document.getElementById("add-post__name");
    const addPostInfo = document.getElementById("add-post__text");
  
    addPostModal.style.display = "block";
  
    addPostModal.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const postData = {
        userName: addPostName.value,
        info: addPostInfo.value,
      };
  
      fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
       .then((response) => response.json())
       .then((data) => {
          const li = document.createElement("li");
          li.classList = "post-item";
          li.dataset.postId = data.id;
          li.innerHTML = `
                    <h1 class="user">${data.userName}</h1>
                    <p class="post-info">${data.info}</p>
                    <button class="edit-post-btn">Edit Post</button>
                    <button class="comment-btn">add comment</button>
                    <div class="comments-container"></div>
                `;
          postsList.appendChild(li);
        })
       .catch((error) => {
          console.error("Error:", error);
        });
  
      addPostModal.style.display = "none";
    });
  }
addPostBtn.addEventListener("click", () => {
  const addPostModal = document.getElementById("addPostModal");
  addPostModal.style.display = "block";
  addNewPost();
});

async function deletePost(postId) {
    const server = `http://localhost:3000/posts`;
    try {
        const response = await fetch(`${server}/${postId}`, {
            method: "DELETE",
        });
            alert("Post deleted");
            postsList.innerHTML = "";
            createStories();
    } catch (error) {
        console.error("Error delete", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
  
    searchInput.addEventListener("input", _.debounce(handleSearch, 500));
  
    let searchQuery = "";
  
    function handleSearch() {
      const inputValue = searchInput.value.trim();
  
      if (inputValue === "") {
        createStories();
        return;
      }
  
      searchQuery = inputValue;
      postsList.innerHTML = "";
      searchPosts();
    }
  
    async function searchPosts() {
      const server = `http://localhost:3000/posts`;
      try {
        const response = await fetch(server);
        const data = await response.json();
  
        const filteredPosts = data.filter((post) => {
          const userName = post.userName.toLowerCase();
          const info = post.info.toLowerCase();
          const query = searchQuery.toLowerCase();
  
          return userName.includes(query) || info.includes(query);
        });
  
        filteredPosts.forEach((post) => {
          const li = document.createElement("li");
          li.classList = "post-item";
          li.dataset.postId = post.id;
          li.innerHTML = `
              <h1 class="user">${post.userName}</h1>
              <p class="post-info">${post.info}</p>
              <button class="edit-post-btn">Edit Post</button>
              <button class="delete-post-btn">Delete Post</button>
              <button class="comment-btn">add comment</button>
              <div class="comments-container"></div>
          `;
          postsList.appendChild(li);
        });
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  });