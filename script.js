document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsSection = document.getElementById('posts');

    // Fetch all posts when the page loads
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsSection.appendChild(postElement);
            });
        });

    // Handle form submission
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(postForm);
        const title = formData.get('title');
        const content = formData.get('content');

        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(post => {
            const postElement = createPostElement(post);
            postsSection.prepend(postElement);
            postForm.reset();
        });
    });

    function createPostElement(post) {
        const postElement = document.createElement('article');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
        `;
        return postElement;
    }
});