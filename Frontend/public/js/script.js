const inputs = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}
function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

document.getElementById('loginForm').addEventListener('submit', submitLogin);

function submitLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Application-Key': 'TUa446489ced783d84f0dcf6912b335af7ffec95e1ee07c930d03d8142475b2ee76dd1afa5d3ecde5d2d2c8de394f2e088'
    },
    body: JSON.stringify({ 
      UserName : username, 
      PassWord : password 
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to authenticate with university API.');
    }
    return response.json();
  })
  .then(data => {
    const messageElement = document.getElementById('message');

    if (data.message === 'Success') {
      messageElement.innerHTML = `
        <p>Login status: ${data.message}</p>
        <p>Hello ${data.displayname_en}</p>
        <p>Username: ${data.username}</p>
        <p>Email: ${data.email}</p>
        <p>Faculty: ${data.faculty}</p>
        <p>Department: ${data.department}</p>
        <p>Status: ${data.status}</p>
      `;

      // Check if user status is true, then add user data to the backend
      if (data.status === true) {
        fetch('http://localhost:8080/api/students/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userName: data.username || "defaultUsername",
            type: data.type || "defaultType",               
            displayname_en: data.displayname_en || "Unknown",
            email: data.email || "unknown@example.com",
            faculty: data.faculty || "Unknown Faculty"
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to save user data to backend.');
          }
          return response.json();
        })
        .then(data => {
          console.log('Added successfully:', data);
          document.getElementById('message').innerText = 'Login success and data added.';
        })
        .catch(error => {
          console.error('Error adding user data:', error);
          document.getElementById('message').innerText = 'Error adding user data: ' + error.message;
        });
      } else {
        // If status is not true, alert the message returned from API
        alert(data.message);
      }
    } else {
      // If authentication fails, alert the message returned from API
      alert(data.message);
      document.getElementById('message').innerText = 'Login failed: ' + data.message;
    }
  })
  .catch(error => {
    // Handle errors such as network issues or JSON parsing issues
    console.error('Error:', error);
    document.getElementById('message').innerText = 'An error occurred: ' + error.message;
    alert('An error occurred: ' + error.message);
  });
}
