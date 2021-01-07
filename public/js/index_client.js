var socket = io();
$(function(){
    $('#message_form').submit(function(){
        var input_data = []
        input_data.push(escapeHTML($('#input_timeout').val()))
        input_data.push(escapeHTML($('#input_machine').val()))
        input_data.push(escapeHTML($('#input_used').val()))
        input_data.push(escapeHTML($('#input_name').val()));
        socket.emit('input', input_data);
        $('#input_timeout').val('');
        $('#input_machine').val('');
        $('#input_used').val('');
        $('#input_name').val('');
        return false;
        });

        socket.on('table_row', function(table_data){
            $('#mactable').append($(`<tr> <th scope="row"></th> <td>${table_data[0]}</td> <td>${table_data[1]}</td> <td>${table_data[2]}</td> <td>${table_data[3]}</td> </tr>`));
        });
        socket.on('table_row_delete', function(table_no){
            $(`#${table_no}`).remove();
        });
});
        
function edit_request(unique_id){
    console.log(unique_id);
          
};
function return_request(unique_id, table_no){
    socket.emit('return', unique_id, table_no);
};


function escapeHTML(string){
    var new_string = string.replace(/\&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&#x27');
    return new_string
};