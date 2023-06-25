//==========================================
//Get all connections
//==========================================
$(document).ready(function(){
    $.ajax({
      url:'/contacts',
      type:'GET',
      success: function(data){
        data.forEach(function(contact){
          addConnectionsToTable(contact);
        });
      }
    });

    // Handle delete button click
    $(document).on('click', '.deleteBtn', function() {
      var contactId = $(this).data('id');
      $.ajax({
        url: '/api/contacts/' + contactId,
        type: 'DELETE',
        success: function() {
          $('#' + contactId).remove();
          location.reload(); // Reload the page after successful deletion
        }
      });
    });

    // Handle update button click
    $(document).on('click', '.updateBtn', function() {
      var contactId = $(this).data('id');
      window.location.href = '/update.html?id=' + contactId;
    });
  });
  
  