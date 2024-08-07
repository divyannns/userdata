function saveUser() {
  const user = {
    firstName: $('#firstName').val(),
    lastName: $('#lastName').val(),
    mobileNo: $('#mobileNo').val(),
    email: $('#email').val(),
    address: $('#address').val(),
    street: $('#street').val(),
    city: $('#city').val(),
    state: $('#state').val(),
    country: $('#country').val(),
    loginId: $('#loginId').val(),
    password: $('#password').val()
  };

  $.ajax({
    url: 'http://localhost:3000/api/users',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: function(data) {
      alert('User saved successfully');
      $('#userForm')[0].reset();
    },
    error: function(error) {
      const errorMessages = error.responseJSON && error.responseJSON.errors ? error.responseJSON.errors : { general: 'Unknown error' };
      let errorMessageText = 'Error(s):\n';
      for (const key in errorMessages) {
        errorMessageText += `${key}: ${errorMessages[key]}\n`;
      }
      alert(errorMessageText);
    }
  });
}

function getUsers() {
  $.ajax({
    url: 'http://localhost:3000/api/users',
    type: 'GET',
    success: function(data) {
      let usersHtml = '<ul>';
      data.forEach(user => {
        usersHtml += `<li>${user.firstName} ${user.lastName} - ${user.email}</li>`;
      });
      usersHtml += '</ul>';
      $('#users').html(usersHtml);
    },
    error: function(error) {
      const errorMessage = error.responseJSON && error.responseJSON.message ? error.responseJSON.message : 'Unknown error';
      alert('Error: ' + errorMessage);
    }
  });
}
