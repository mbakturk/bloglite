import { Container } from "inversify";
import { MarkdownIt } from "markdown-it";
import { Config, config } from './config-reader';
import { DashboardController } from './controller/dashboard.controller';
import { EditorController } from './controller/editor.controller';
import { LoginController } from './controller/login.controller';
import { PostController } from './controller/post.controller';
import { RSSController } from './controller/rss.controller';
import { Database } from "./database";
import { LoggerCreator, SysLogger } from './logger';
import { PostDAO } from './repo/post.dao';
import { UserDAO } from './repo/user.dao';
import markdownit = require("markdown-it");
import hljs = require("highlight.js");
import markdownItEmoji = require("markdown-it-emoji")
import twemoji = require("twemoji");

const container = new Container();
container.bind<Config>("Config").toConstantValue(config);
container.bind<SysLogger>("Logger").toConstantValue(LoggerCreator(container));

container.bind<Database>(Database).toSelf().inSingletonScope();

container.bind<UserDAO>(UserDAO).toSelf().inSingletonScope();
container.bind<PostDAO>(PostDAO).toSelf().inSingletonScope();
container.bind<LoginController>(LoginController).toSelf();
container.bind<DashboardController>(DashboardController).toSelf();
container.bind<EditorController>(EditorController).toSelf();
container.bind<PostController>(PostController).toSelf();
container.bind<RSSController>(RSSController).toSelf();


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
    },
    html: true,
    linkify: true,
    typographer: true
}).use(markdownItEmoji).use(
    require('markdown-it-video'), { // <-- this use(package_name) is required
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 },
        vine: { width: 600, height: 600, embed: 'simple' },
        prezi: { width: 550, height: 400 }
    });

md.renderer.rules.emoji = function (token, idx) {
    return twemoji.parse(token[idx].content);
};

container.bind<MarkdownIt>('MarkdownIt').toConstantValue(md);


export { container };

