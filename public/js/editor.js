require.config({
    paths: {
        jquery: "//code.jquery.com/jquery-3.2.1.min",
        bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.bundle.min",
        markdownIt: "//cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.1/markdown-it",
        highlight: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min",
        //twemoji: "//cdnjs.cloudflare.com/ajax/libs/twemoji/2.6.0/2/twemoji.min",
        markdownItEmoji: "//cdnjs.cloudflare.com/ajax/libs/markdown-it-emoji/1.4.0/markdown-it-emoji.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(["jquery", "markdownIt", "highlight", "markdownItEmoji", "bootstrap"],
    function ($, markdownIt, hljs, markdownItEmoji) {
        // Actual default values
        var md = markdownIt({
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    } catch (__) { }
                }

                return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
            }
        }).use(markdownItEmoji);

        md.renderer.rules.emoji = function (token, idx) {
            return twemoji.parse(token[idx].content);
        };

        window.visual = function () {
            $("#nav-visual").html(md.render($("#entry").val()));
        }

        $("#mode-tab a").on("click", function (e) {
            e.preventDefault()
            $(this).tab("show")
        })

        window.editor = {};

        window.editor.publish = function (postId) {
            var post = {
                id: postId,
                title: $("#title").val(),
                entry: $("#entry").val()
            }

            $.post(post.id === -1 ? "/s/createPost" : "/s/updatePost", post)
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

        }

    });