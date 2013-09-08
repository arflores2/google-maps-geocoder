$(function() {
	$('#send').on('click', function() {
		var url = $('#input').val();
		
		function getSelected() {
			if(window.getSelection) {
				return window.getSelection();
			}
			else if(document.getSelection) {
				return document.getSelection();
			}
			else {
				var selection = document.selection && document.selection.createRange();
				if(selection.text)
					return selection.text;
			}
		
			return false;	
		}
		
		if(url != '') {
			$.ajax({
				url: '/proxy',
				method: 'post',
				data: {
					url: url
				},
				success: function(html) {
					console.log('spitting out html');
					$('#site')
						.html(html);
						
					debugger;
					$('#site').on('mouseup', 'div', function(event) {
							console.log('mouseup');
							var selectedText = getSelected();
							console.log(selectedText);
						});
				},
				error: function() {
					console.log('fail');
				}
			});	
		}
	})
})