import { Container } from "inversify";
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

export { container };

