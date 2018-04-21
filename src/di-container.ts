import { EditorController } from './controller/editor.controller';
import { controller } from 'inversify-express-utils';
import { DashboardController } from './controller/dashboard.controller';
import { LoginController } from './controller/login.controller';
import { PostDAO } from './repo/post.dao';
import { UserDAO } from './repo/user.dao';
import { Container } from "inversify";
import * as Database from "better-sqlite3";

const container = new Container();
container.bind<Database>(Database).toConstantValue(new Database("blog.db3", { fileMustExist: true }));
container.bind<UserDAO>(UserDAO).toSelf().inSingletonScope();
container.bind<PostDAO>(PostDAO).toSelf().inSingletonScope();
container.bind<LoginController>(LoginController).toSelf();
container.bind<DashboardController>(DashboardController).toSelf();
container.bind<EditorController>(EditorController).toSelf();

export { container };