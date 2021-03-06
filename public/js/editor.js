require.config({
    paths: {
        jquery: "//code.jquery.com/jquery-3.2.1.min",
        bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.bundle.min",
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(["jquery", "bootstrap"],
    function ($) {
        window.editor = {};

        window.editor.publish = function (postId) {
            var post = {
                id: postId,
                title: $("#title").val(),
                entry: quill.root.innerHTML,
                permalink: $("#permalink").val()
            }

            $.post(post.id === -1 ? securePath +"createPost" : securePath +"updatePost", post)
                .done(function () {
                    $("#alert-container").append(
                        `<div class="alert alert-warning alert-dismissible fade show col" role="alert">
                            <strong>Congratulations!</strong> You published your post successfully.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                    );
                })

        };

        window.editor.setPermalink = function (text) {
            return $.post(securePath + "getPermalink", { permalink: text }).done(function (resp) {
                $("#permalink").val(resp.permalink);
            })
        }

    });