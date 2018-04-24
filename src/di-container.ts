import { PostController } from './controller/post.controller';
import { EditorController } from './controller/editor.controller';
import { controller } from 'inversify-express-utils';
import { DashboardController } from './controller/dashboard.controller';
import { LoginController } from './controller/login.controller';
import { PostDAO } from './repo/post.dao';
import { UserDAO } from './repo/user.dao';
import { Container } from "inversify";
import * as Database from "better-sqlite3";
import { MarkdownIt } from "markdown-it";
import markdownit = require("markdown-it");
import hljs = require("highlight.js");
import markdownItEmoji = require("markdown-it-emoji")
import twemoji = require("twemoji");

const container = new Container();
container.bind<Database>(Database).toConstantValue(new Database("blog.db3", { fileMustExist: true }));
container.bind<UserDAO>(UserDAO).toSelf().inSingletonScope();
container.bind<PostDAO>(PostDAO).toSelf().inSingletonScope();
container.bind<LoginController>(LoginController).toSelf();
container.bind<DashboardController>(DashboardController).toSelf();
container.bind<EditorController>(EditorController).toSelf();
container.bind<PostController>(PostController).toSelf();


// Initialize markdown-it
const md: MarkdownIt = new markdownit({
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

container.bind<MarkdownIt>(markdownit).toConstantValue(md);


export { container };