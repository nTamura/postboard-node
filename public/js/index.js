$(function(){
  $('[data-toggle="popover"]').popover();

  $('.deletePost').on('click', deletePost);

});

function deletePost(){
  const confirmation = confirm('Delete post?');
  if(confirmation){
    $.ajax({
      type:'DELETE',
      url: '/users/delete/'+$(this).data('id')
    }).done(function(response){
      window.location.replace('/');
    });
    window.location.replace('/');
  } else {
    return false;
  }
};
