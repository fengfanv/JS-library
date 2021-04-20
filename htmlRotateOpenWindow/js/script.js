// JavaScript Document
// login页面js
$("#login_button").click(
		function() {
			if ($("#user").val() == '') {
				alert('账号不能为空！');
			} else {
				if ($("#password").val() == '') {
					alert('密码不能为空！');
				} else {
					$.ajax({
						url : "",
						type : "POST",
						data : {
							user : $("#user").val(),
							password : $("#password89").val()
						},
						dataType : "json",
						success : function(loginInfo) {
							
						},
						error : function(jqXHR) {
							console.log("登录错误："+ jqXHR.readyState+';'+jqXHR.status+';');
						}
					});
				}
			}

		});

