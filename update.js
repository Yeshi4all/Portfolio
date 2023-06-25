//=========================================================================
//Student
//=========================================================================
/**
 * Name: Yeshi Ngawang
 * Id: 301302902
 */
$(document).ready(function() {
    //==========================================================
    // Get the contact ID from the URL path
    //==========================================================
    var contactId = window.location.pathname.split('/').pop();

    //===============================================================
    // Retrieve the existing contact details and populate the form
    //===============================================================
    $.ajax({
      url: '/api/contacts/' + contactId,
      type: 'GET',
      success: function(contact) {
        $('#name').val(contact.name);
        $('#number').val(contact.phoneNumber);
        $('#email').val(contact.email);
      }
    });
  
    //================================================================
    // Handle form submission
    //================================================================
    $('#updateForm').submit(function(event) {
      event.preventDefault();
  
      var updatedContact = {
        name: $('#name').val(),
        phoneNumber: $('#number').val(),
        email: $('#email').val()
      };
  
      $.ajax({
        url: '/api/contacts/' + contactId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedContact),
        success: function() {
          // Redirect to the contact list view after successful update
          window.location.href = '/contact';
        }
      });
    });  
});
  